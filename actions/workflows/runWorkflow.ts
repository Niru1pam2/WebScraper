"use server";

import prisma from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
  WorkflowStatus,
} from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function RunWorkflow(form: {
  workflowId: string;
  flowDefintion?: string;
}) {
  const { userId } = await auth.protect();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const { workflowId, flowDefintion } = form;

  if (!workflowId) {
    throw new Error("Workflow ID is required");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      userId,
      id: workflowId,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  let executionPlan: WorkflowExecutionPlan = [];

  let workflowDefinition = flowDefintion;

  if (workflow.status === WorkflowStatus.PUBLISHED) {
    if (!workflow.executionPlan) {
      throw new Error("No execution plan found in the published workflow");
    }
    executionPlan = JSON.parse(workflow.executionPlan);
    workflowDefinition = workflow.defintion;
  } else {
    if (!flowDefintion) {
      throw new Error("Flow defintion is required");
    }

    const flow = JSON.parse(flowDefintion);

    const result = FlowToExecutionPlan(flow.nodes, flow.edges);

    if (result.error) {
      throw new Error("Flow definition not valid");
    }

    if (!result.executionPlan) {
      throw new Error("no execution plan generated");
    }

    executionPlan = result.executionPlan;
  }

  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      status: WorkflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.MANUAL,
      definition: workflowDefinition,
      phases: {
        create: executionPlan.flatMap((phase) => {
          return phase.nodes.flatMap((node) => {
            return {
              userId,
              status: ExecutionPhaseStatus.CREATED,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label,
            };
          });
        }),
      },
    },
    select: {
      id: true,
      phases: true,
    },
  });

  if (!execution) {
    throw new Error("Workflow execution not created");
  }

  ExecuteWorkflow(execution.id);

  redirect(`/workflow/runs/${workflowId}/${execution.id}`);
}

//9:40
