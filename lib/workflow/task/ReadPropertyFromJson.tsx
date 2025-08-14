import { TaskParamType, TaskType } from "@/types/tasks";
import { WorkflowTask } from "@/types/workflow";
import { FileJson2Icon } from "lucide-react";

export const ReadPropertyFromJsonTask = {
  type: TaskType.READ_PROPERTY_FROM_JSON,
  label: "Read property from Json",
  icon: (props) => <FileJson2Icon className="stroke-orange-400" {...props} />,
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "Json",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Property name",
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const,

  outputs: [
    {
      name: "Selector",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;
