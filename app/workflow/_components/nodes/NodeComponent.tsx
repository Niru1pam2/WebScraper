import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import NodeCard from "./NodeCard";
import NodeHeader from "./NodeHeader";
import { AppNodeData } from "@/types/appNode";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { NodeInputs, NodeInput } from "./NodeInputs";
import { NodeOutput, NodeOutputs } from "./NodeOutputs";

const NodeComponent = memo((props: NodeProps) => {
  const nodedata = props.data as AppNodeData;
  const task = TaskRegistry[nodedata.type];
  return (
    <NodeCard nodeId={props.id} isSelected={!!props.selected}>
      <NodeHeader taskType={nodedata.type} nodeId={props.id} />
      <NodeInputs>
        {task.inputs.map((input) => (
          <NodeInput input={input} key={input.name} nodeId={props.id} />
        ))}
      </NodeInputs>

      <NodeOutputs>
        {task.outputs.map((output) => (
          <NodeOutput output={output} key={output.name} />
        ))}
      </NodeOutputs>
    </NodeCard>
  );
});

export default NodeComponent;
NodeComponent.displayName = "NodeComponent";
