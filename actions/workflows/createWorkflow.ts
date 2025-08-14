"use server";

import prisma from "@/lib/prisma";
import {
  createWorkflowSchema,
  createWorkflowSchemaType,
} from "@/schema/workflow";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { AppNode } from "@/types/appNode";
import { Edge } from "@xyflow/react";
import { TaskType } from "@/types/tasks";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";

export async function CreateWorkflow(form: createWorkflowSchemaType) {
  const { success, data } = createWorkflowSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const initialFlow: { nodes: AppNode[]; edges: Edge[] } = {
    nodes: [],
    edges: [],
  };

  initialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER));

  const result = await prisma.workflow.create({
    data: {
      userId,
      defintion: JSON.stringify(initialFlow),
      ...data,
      status: WorkflowStatus.DRAFT,
    },
  });

  return result.id;
}
