import { Handle, Position } from "reactflow";
import { Button } from "../ui/button";

interface CustomNodeProps {
  data: { label: string };
}

const HomePageNode = ({ data }: CustomNodeProps) => {
  return (
    <Button
      disabled
      size={"lg"}
      className="inline-flex disabled:opacity-100  h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400  transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
    >
      {data.label}
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 bg-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 bg-white"
      />
    </Button>
  );
};

const FixedNode = ({ data }: CustomNodeProps) => {
  return (
    <h1 className="text-6xl font-bold">
      {data.label}
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 bg-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 bg-white"
      />
    </h1>
  );
};

export { FixedNode, HomePageNode };
