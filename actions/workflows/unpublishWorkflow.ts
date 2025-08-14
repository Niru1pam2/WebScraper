"use server";

import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

export async function UnpublishWorkflow(id: string) {
  const { userId } = await auth.protect();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  if (workflow.status !== WorkflowStatus.PUBLISHED) {
    throw new Error("Workfllow is not published");
  }

  await prisma.workflow.update({
    where: {
      id,
      userId,
    },
    data: {
      status: WorkflowStatus.DRAFT,
      executionPlan: null,
      creditsCost: 0,
    },
  });
}
