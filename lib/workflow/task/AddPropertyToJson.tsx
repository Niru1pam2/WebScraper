import { TaskParamType, TaskType } from "@/types/tasks";
import { WorkflowTask } from "@/types/workflow";
import { DatabaseIcon } from "lucide-react";

export const AddPropertyToJsonTask = {
  type: TaskType.READ_PROPERTY_FROM_JSON,
  label: "Add property to Json",
  icon: (props) => <DatabaseIcon className="stroke-orange-400" {...props} />,
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
    {
      name: "Property value",
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const,

  outputs: [
    {
      name: "Json",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;
