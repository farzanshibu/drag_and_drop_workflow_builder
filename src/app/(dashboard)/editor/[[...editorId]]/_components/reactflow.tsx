/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { CommandDialogBlock } from "@/components/global/command-add-block";
import useSaveWorkflowToLocal from "@/hooks/useSaveWorkflowtoLocal";
import useWorkflow from "@/hooks/useWorkflow";
import { useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  SelectionMode,
} from "reactflow";
import "reactflow/dist/style.css";
import AddBlockButton from "./add-block-button";

export default function ReactFlowContainer({ id }: { id: string }) {
  const {
    nodes,
    onNodesChange,
    edges,
    onEdgesChange,
    nodeTypes,
    edgeTypes,
    onConnect,
    setEdges,
    setNodes,
  } = useWorkflow(id);

  const { saveWorkflow } = useSaveWorkflowToLocal(id);

  useEffect(() => {
    saveWorkflow();
  }, [nodes, edges]);

  return (
    <ReactFlow
      nodes={nodes}
      nodeTypes={nodeTypes}
      edges={edges}
      edgeTypes={edgeTypes}
      onNodesChange={onNodesChange}
      selectionMode={SelectionMode.Partial}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    >
      <Controls />
      <MiniMap
        pannable
        nodeColor="#00bfff"
        maskColor="#42445AD1"
        style={{
          width: 200,
          height: 100,
          backgroundColor: "#03A9F4B3",
          borderRadius: 10,
        }}
        color="#ff0"
      />

      <Background />

      <Panel position="top-left">
        <AddBlockButton />
        <CommandDialogBlock />
      </Panel>
    </ReactFlow>
  );
}
