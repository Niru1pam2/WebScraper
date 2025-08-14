import { TaskParamType, TaskType } from "@/types/tasks";
import { WorkflowTask } from "@/types/workflow";
import { ArrowUp } from "lucide-react";

export const ScrollElement = {
  type: TaskType.SCROLL_ELEMENT,
  label: "Scroll to Element",
  icon: (props) => <ArrowUp className="stroke-orange-400" {...props} />,
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
