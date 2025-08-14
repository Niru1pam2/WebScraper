import { TaskParamType, TaskType } from "@/types/tasks";
import { WorkflowTask } from "@/types/workflow";
import { MousePointer } from "lucide-react";

export const NavigateUrl = {
  type: TaskType.NAVIGATE_URL,
  label: "Navigate Url",
  icon: (props) => <MousePointer className="stroke-orange-400" {...props} />,
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
      variant: "textarea",
    },
    {
      name: "Url",
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const,

  outputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
    },
  ],
} satisfies WorkflowTask;
