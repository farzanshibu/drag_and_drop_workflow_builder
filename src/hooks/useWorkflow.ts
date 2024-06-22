import CustomEdge from '@/components/global/custom-edge';
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
import { useNodeDataStore } from '@/store/node-data';
import { useTableDataStore } from '@/store/table';
import { useWorkflowStore } from '@/store/workflows';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { addEdge, useEdgesState, useNodesState, useReactFlow, type OnConnect } from 'reactflow';
import { toast } from 'sonner';

const useWorkflow = (id: string) => {
    const router = useRouter();
    const setNodesData = useNodeDataStore((state) => state.setNodesData);
    const { getSingleWorkFlow } = useWorkflowStore((state) => ({
        getSingleWorkFlow: state.getSingleWorkFlow,
    }));
    const setTableData = useTableDataStore((state) => state.setTableData);
    const getSingleData = useNodeDataStore((state) => state.getSingleData);

    const [workflowNotFound, setWorkflowNotFound] = useState(false);

    const workFlow = getSingleWorkFlow(id);

    useEffect(() => {
        if (!workFlow) {
            setWorkflowNotFound(true);
            router.replace("/dashboard");
        }
    }, [workFlow, router]);

    useEffect(() => {
        if (workFlow && Array.isArray(workFlow.nodeDataArr) && workFlow.nodeDataArr.length > 0) {
            setNodesData(workFlow.nodeDataArr);
        }
    }, [workFlow, setNodesData]);

    const initialNodes = workFlow?.nodes || [];
    const initialEdges = workFlow?.edges || [];

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { getNode } = useReactFlow();

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

    useEffect(() => {
        const selectedNode = nodes.find((node) => node.selected);
        if (
            selectedNode &&
            (selectedNode.type?.includes("input") ||
                selectedNode.type?.includes("transform"))
        ) {
            setTableData(getSingleData(selectedNode.id)?.data_target);
        }
    }, [nodes, setTableData, getSingleData]);

    return {
        nodes,
        setNodes,
        onNodesChange,
        edges,
        setEdges,
        onEdgesChange,
        onConnect,
        nodeTypes,
        edgeTypes,
    };
};

export default useWorkflow;
