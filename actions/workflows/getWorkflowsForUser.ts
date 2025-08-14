"use async";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetWorkflowsForUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  return await prisma.workflow.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}
