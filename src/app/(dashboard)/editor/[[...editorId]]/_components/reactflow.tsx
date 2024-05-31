"use client";
import { CommandDialogBlock } from "@/components/global/command-add-block";
import CustomEdge from "@/components/global/custom-edge";
import { InputExampleNode, InputFileNode } from "@/components/nodes/input-node";
import {
  MiscExportNode,
  MiscMarkdownNode,
  MiscStatNode,
} from "@/components/nodes/misc-node";
import {
  TransformFilterNode,
  TransformGroupNode,
  TransformMergeNode,
  TransformRenameNode,
  TransformSliceNode,
  TransformSortNode,
} from "@/components/nodes/transformer-node";
import {
  VisualizationBarChartNode,
  VisualizationLineChartNode,
  VisualizationScatterplotNode,
} from "@/components/nodes/visualization-node";
import { useNodeDataStore } from "@/store/node-data";
import { useTableDataStore } from "@/store/table";
import { useCallback, useEffect, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  SelectionMode,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Edge,
  type Node,
  type OnConnect,
} from "reactflow";
import "reactflow/dist/style.css";
import { toast } from "sonner";
import AddBlockButton from "./add-block-button";

interface props {
  initialNodes: Node[];
  initialEdges: Edge[];
}

export default function ReactFlowContainer({
  initialNodes,
  initialEdges,
}: props) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { getNode } = useReactFlow();
  const setTableData = useTableDataStore((state) => state.setTableData);
  const getSingleData = useNodeDataStore((state) => state.getSingleData);
  const nodeTypes = useMemo(
    () => ({
      "input-file": InputFileNode,
      "input-example": InputExampleNode,
      "transform-filter": TransformFilterNode,
      "transform-merge": TransformMergeNode,
      "transform-group": TransformGroupNode,
      "transform-slice": TransformSliceNode,
      "transform-rename": TransformRenameNode,
      "transform-sort": TransformSortNode,
      "visualization-barchart": VisualizationBarChartNode,
      "visualization-histogram": VisualizationLineChartNode,
      "visualization-scatterplot": VisualizationScatterplotNode,
      "misc-markdown": MiscMarkdownNode,
      "misc-export": MiscExportNode,
      "misc-stat": MiscStatNode,
    }),
    []
  );

  const edgeTypes = useMemo(
    () => ({
      buttonline: CustomEdge,
    }),
    []
  );

  const onConnect: OnConnect = useCallback(
    (params) => {
      if (!(params.source && params.target)) {
        return;
      }
      if (!getSingleData(params.source)?.data_target) {
        toast.error("Cannot connect to a node without an output");
        return;
      }

      const targetNode = getNode(params.target);
      const sourceNode = getNode(params.source);

      setEdges((eds) =>
        addEdge({ ...params, type: "buttonline", animated: true }, eds)
      );

      const edgeId = `${params.source}@${params.target}`;

      if (sourceNode) {
        const updatedSourceNode = {
          ...sourceNode,
          data: {
            ...sourceNode.data,
            edgesIDs: [...(sourceNode.data.edgesIDs || []), edgeId],
            isConnected: true,
          },
        };

        setNodes((nds) =>
          nds.map((node) =>
            node.id === sourceNode.id ? updatedSourceNode : node
          )
        );
      }

      if (targetNode) {
        const updatedTargetNode = {
          ...targetNode,
          data: {
            ...targetNode.data,
            edgesIDs: [...(targetNode.data.edgesIDs || []), edgeId],
            isConnected: true,
          },
        };

        setNodes((nds) =>
          nds.map((node) =>
            node.id === targetNode.id ? updatedTargetNode : node
          )
        );
      }
    },
    [getNode, setEdges, setNodes, getSingleData]
  );
  const nodeDataArr = useNodeDataStore((state) => state.nodeDataArr);
  useEffect(() => {
    const selectedNode = nodes.find((node) => node.selected);
    if (
      selectedNode &&
      selectedNode.type?.startsWith("input") &&
      selectedNode.type?.startsWith("transform")
    ) {
      setTableData(getSingleData(selectedNode.id)?.data_target);
    }
  }, [nodes, setTableData, getSingleData, nodeDataArr]);

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
