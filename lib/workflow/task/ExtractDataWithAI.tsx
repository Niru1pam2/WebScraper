import { TaskParamType, TaskType } from "@/types/tasks";
import { WorkflowTask } from "@/types/workflow";
import { BrainIcon } from "lucide-react";

export const ExtractDataWithAITask = {
  type: TaskType.EXTRACT_DATA_WITH_AI,
  label: "Extract data with AI",
  icon: (props) => <BrainIcon className="stroke-rose-400" {...props} />,
  isEntryPoint: false,
  credits: 4,
  inputs: [
    {
      name: "Html",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea",
    },
    {
      name: "Credentials",
      type: TaskParamType.CREDENTIAL,
      required: true,
    },
    {
      name: "Prompt",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea",
    },
  ] as const,

  outputs: [
    {
      name: "Json",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;
