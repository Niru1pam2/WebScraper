import { TaskParamType, TaskType } from "@/types/tasks";
import { WorkflowTask } from "@/types/workflow";
import { SendIcon } from "lucide-react";

export const DeliverViaWebhook = {
  type: TaskType.DELIVER_VIA_WEBHOOK,
  label: "Deliver via webhook",
  icon: (props) => <SendIcon className="stroke-orange-400" {...props} />,
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "Target URL",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea",
    },
    {
      name: "Extracted text",
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const,

  outputs: [],
} satisfies WorkflowTask;
