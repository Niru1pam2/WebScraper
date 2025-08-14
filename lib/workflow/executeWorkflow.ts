import "server-only";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow";
import { ExecutionPhase } from "../generated/prisma";
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/registry";
import { ExecuterRegistry } from "./executor/registry";
import { Enviroment, ExecutionEnviroment } from "@/types/executer";
import { TaskParamType } from "@/types/tasks";
import { Browser, Page } from "puppeteer";
import { Edge } from "@xyflow/react";
import { LogCollector } from "@/types/log";
import { createLogCollector } from "../log";

export async function ExecuteWorkflow(executionId: string, nextRunAt?: Date) {
  const execution = await prisma.workflowExecution.findUnique({
    where: {
      id: executionId,
    },
    include: {
      workflow: true,
      phases: true,
    },
  });

  if (!execution) {
    throw new Error("execution not found");
  }

  const edges = JSON.parse(execution.definition).edges as Edge[];

  //setup execution enviroment
  const enviroment: Enviroment = {
    phases: {},
  };

  //initliase workflow execution
  await initializeWorkflowExecution(
    executionId,
    execution.workflowId,
    nextRunAt
  );

  //initialise phases status pending
  await initializePhaseStatuses(execution);

  let executionFailed = false;
  let creditsConsumed = 0;

  for (const phase of execution.phases) {
    //execute each phase
    const phaseExecution = await executeWorkflowPhase(
      phase,
      enviroment,
      edges,
      execution.userId
    );

    creditsConsumed += phaseExecution.creditsConsumed;
    if (!phaseExecution.success) {
      executionFailed = true;
      break;
    }
  }

  //finalize the execution
  await finalizeWorkflowExecution(
    executionId,
    execution.workflowId,
    executionFailed,
    creditsConsumed
  );
  //clean up enviroment
  await cleanupEnviroment(enviroment);
}

///////////////////////////////////////
async function initializeWorkflowExecution(
  executionId: string,
  workflowId: string,
  nextRunAt?: Date
) {
  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      startedAt: new Date(),
      status: WorkflowExecutionStatus.RUNNING,
    },
  });

  await prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      lastRunAt: new Date(),
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
      lastRunId: executionId,
      ...(nextRunAt && { nextRunAt }),
    },
  });
}

////////////////
async function initializePhaseStatuses(execution: any) {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase: any) => phase.id),
      },
    },
    data: {
      status: ExecutionPhaseStatus.PENDING,
    },
  });
}

/////////////
async function finalizeWorkflowExecution(
  executionId: string,
  workflowId: string,
  executionFailed: boolean,
  creditsConsumed: number
) {
  const finalStatus = executionFailed
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED;

  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      creditsConsumed,
    },
  });

  await prisma.workflow
    .update({
      where: { id: workflowId, lastRunId: executionId },
      data: {
        lastRunStatus: finalStatus,
      },
    })
    .catch((err) => {});
}

/////////
async function executeWorkflowPhase(
  phase: ExecutionPhase,
  enviroment: Enviroment,
  edges: Edge[],
  userId: string
) {
  const logCollector = createLogCollector();
  const startedAt = new Date();

  const node = JSON.parse(phase.node) as AppNode;

  //setup enviroment Record
  setupEnviromentForPhase(node, enviroment, edges);

  //update phase status
  await prisma.executionPhase.update({
    where: { id: phase.id },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
      inputs: JSON.stringify(enviroment.phases[node.id].inputs),
    },
  });

  const creditsRequired = TaskRegistry[node.data.type].credits;

  //Decrement user balance
  let success = await decrementCredits(userId, creditsRequired, logCollector);
  const creditsConsumed = success ? creditsRequired : 0;

  if (success) {
    //can execute phase if credits are sufficient
    success = await executePhase(phase, node, enviroment, logCollector);
  }
  //Execute phase simulation
  const outputs = enviroment.phases[node.id].outputs;

  await finalizePhase(
    phase.id,
    success,
    outputs,
    logCollector,
    creditsConsumed
  );

  return { success, creditsConsumed };
}

/////////////
async function finalizePhase(
  phaseId: string,
  success: boolean,
  outputs: any,
  logCollector: LogCollector,
  creditsConsumed: number
) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;

  await prisma.executionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      outputs: JSON.stringify(outputs),
      creditsCost: creditsConsumed,
      logs: {
        createMany: {
          data: logCollector.getAll().map((log) => ({
            message: log.message,
            timestamp: log.timestamp,
            logLevel: log.level,
          })),
        },
      },
    },
  });
}

////////////////
async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
  enviroment: Enviroment,
  logCollector: LogCollector
): Promise<boolean> {
  const runFn = ExecuterRegistry[node.data.type];

  if (!runFn) {
    logCollector.error(`not found executor for ${node.data.type}`);
    return false;
  }

  const executionEnviroment: ExecutionEnviroment<any> =
    createExecutionEnviroment(node, enviroment, logCollector);

  return await runFn(executionEnviroment);
}

////////////
function setupEnviromentForPhase(
  node: AppNode,
  enviroment: Enviroment,
  edges: Edge[]
) {
  enviroment.phases[node.id] = { inputs: {}, outputs: {} };
  const inputs = TaskRegistry[node.data.type].inputs;
  for (const input of inputs) {
    if (input.type === TaskParamType.BROWSER_INSTANCE) continue;
    const inputValue = node.data.inputs[input.name];

    if (inputValue) {
      enviroment.phases[node.id].inputs[input.name] = inputValue;
      continue;
    }

    //connected to output input
    const connectedEdge = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.name
    );

    if (!connectedEdge) {
      console.error("Missing edge for input", input.name, "node id:", node.id);
      continue;
    }

    //not working connectedEdge.targetHandle
    const outputValue =
      enviroment.phases[connectedEdge.source].outputs[
        connectedEdge.targetHandle!
      ];

    enviroment.phases[node.id].inputs[input.name] = outputValue;
  }
}

///////////////
function createExecutionEnviroment(
  node: AppNode,
  enviroment: Enviroment,
  logCollector: LogCollector
): ExecutionEnviroment<any> {
  return {
    getInput: (name: string) => enviroment.phases[node.id]?.inputs[name],

    setOutput: (name: string, value: string) => {
      enviroment.phases[node.id].outputs[name] = value;
    },

    getBrowser: () => enviroment.browser,

    setBrowser: (browser: Browser) => (enviroment.browser = browser),

    getPage: () => enviroment.page,

    setPage: (page: Page) => (enviroment.page = page),

    log: logCollector,
  };
}

///////
async function cleanupEnviroment(enviroment: Enviroment) {
  if (enviroment.browser) {
    await enviroment.browser
      .close()
      .catch((err) => console.error("cannot close browser", err));
  }
}

async function decrementCredits(
  userId: string,
  amount: number,
  logCollector: LogCollector
) {
  try {
    await prisma.userBalance.update({
      where: {
        userId,
        credits: { gte: amount },
      },
      data: {
        credits: { decrement: amount },
      },
    });

    return true;
  } catch (error) {
    console.log(error);
    logCollector.error("insufficient balance");
    return false;
  }
}
