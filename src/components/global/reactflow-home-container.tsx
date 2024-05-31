"use client";
import { useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  Position,
  addEdge,
  useEdgesState,
  useNodesState,
  type Edge,
  type OnConnect,
} from "reactflow";
import "reactflow/dist/style.css";
import CustomEdge from "./custom-edge";
import CustomHandle from "./custom-handle";

type Props = {};

const initialEdges = [
  { id: "1-2", source: "1", target: "2", animated: true, type: "buttonline" },
  { id: "1-3", source: "2", target: "3", animated: true, type: "buttonline" },
];

const initialNodes = [
  {
    id: "1",
    type: "selectorNode",
    data: { label: "Drag and Drop" },
    position: { x: 50, y: -120 },
  },
  {
    id: "2",
    type: "fixedNode",
    data: { label: "WorkFlow Builder" },
    position: { x: 110, y: 0 },
  },
  {
    id: "3",
    type: "selectorNode",
    data: { label: "Easy to use" },
    position: { x: 450, y: 200 },
  },
];

export default function ReactFlowHomeContainer({}: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const nodeTypes = useMemo(
    () => ({ selectorNode: SelectorNode, fixedNode: FixedNode }),
    []
  );

  const edgeTypes = useMemo(
    () => ({
      buttonline: CustomEdge,
    }),
    []
  );

  const onConnect: OnConnect = useCallback(
    (connection) =>
      setEdges((eds: Edge[]) =>
        addEdge({ ...connection, type: "buttonline", animated: true }, eds)
      ),
    [setEdges]
  );

  return (
    <div className="absolute max-w-screen-2xl w-screen h-3/4 md:h-5/6 z-10 ">
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        edgeTypes={edgeTypes}
        fitView
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        translateExtent={[
          [0, 0],
          [500, 500],
        ]}
        panOnDrag={false}
        panOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        zoomOnScroll={false}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

function SelectorNode({ data }: { data: { label: string } }) {
  return (
    <>
      <CustomHandle type="target" position={Position.Left} maxConnection={1} />
      <span className="font-semibold inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
        {data.label}
      </span>
      <CustomHandle type="source" position={Position.Right} maxConnection={1} />
    </>
  );
}
function FixedNode({ data }: { data: { label: string } }) {
  return (
    <>
      <CustomHandle type="target" position={Position.Left} maxConnection={1} />
      <h1 className="text-5xl font-bold text-slate-50">{data.label}</h1>
      <CustomHandle type="source" position={Position.Right} maxConnection={1} />
    </>
  );
}
