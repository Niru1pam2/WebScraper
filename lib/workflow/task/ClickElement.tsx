import { TaskParamType, TaskType } from "@/types/tasks";
import { WorkflowTask } from "@/types/workflow";
import { MousePointer } from "lucide-react";

export const ClickElement = {
  type: TaskType.CLICK_ELEMENT,
  label: "Click Element",
  icon: (props) => <MousePointer className="stroke-orange-400" {...props} />,
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
      variant: "textarea",
    },
    {
      name: "Selector",
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
