"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import parser from "cron-parser";

export async function UpdateWorkflowCron({
  id,
  cron,
}: {
  id: string;
  cron: string;
}) {
  const { userId } = await auth.protect();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  let nextRunAt: Date | null = null;
  try {
    const interval = parser.parse(cron);
    nextRunAt = interval.next().toDate();
  } catch (error: any) {
    console.error("Invalid cron:", error.message);
    // Just log it; don't throw, since client already validated
    nextRunAt = null;
  }

  await prisma.workflow.update({
    where: {
      id,
      userId,
    },
    data: {
      cron,
      nextRunAt,
    },
  });
}
