import { useMemo } from "react";
import {
  Handle,
  getConnectedEdges,
  useNodeId,
  useStore,
  type HandleProps,
} from "reactflow";

interface CustomHandleProps extends HandleProps {
  customStyle?: React.CSSProperties;
  maxConnection: number;
}
const selector = (s: any) => ({
  nodeInternals: s.nodeInternals,
  edges: s.edges,
});

const CustomHandle = (props: CustomHandleProps) => {
  const { nodeInternals, edges } = useStore(selector);
  const nodeId = useNodeId();

  // TODO: Connect Limiter Logic
  const isHandleConnectable = useMemo(() => {
    if (typeof props.isConnectable === "number") {
      const node = nodeInternals.get(nodeId);
      const connectedEdges = getConnectedEdges([node], edges);

      return connectedEdges.length < props.isConnectable;
    }
    return true;
  }, [edges, nodeId, props, nodeInternals]);

  return (
    <Handle
      {...props}
      isConnectable={isHandleConnectable}
      style={{
        width: 8,
        height: 16,
        borderRadius: 4,
        background: props.type === "source" ? "pink" : "lime",
        border: props.type === "source" ? "1px solid pink" : "1px solid lime",
        ...props.customStyle,
      }}
    />
  );
};

export default CustomHandle;
