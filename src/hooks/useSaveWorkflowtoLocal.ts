import { saveWorkflowAction } from "@/app/(dashboard)/editor/[[...editorId]]/_actions/workflow-action";
import { useNodeDataStore } from "@/store/node-data";
import { useWorkflowStore } from "@/store/workflows";
import { useCallback, useEffect, useRef } from 'react';
import { useEdges, useNodes } from "reactflow";
import { toast } from "sonner";

const DEBOUNCE_DELAY = 5000;

const useSaveWorkflowToLocal = (id: string) => {
    const nodes = useNodes();
    const edges = useEdges();
    const getNodesData = useNodeDataStore((state) => state.getNodesData);
    const { getSingleWorkFlow, onSaved } = useWorkflowStore((state) => ({
        onSaved: state.onSaved,
        getSingleWorkFlow: state.getSingleWorkFlow,
    }));
    const workFlow = getSingleWorkFlow(id);

    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const saveWorkflow = useCallback(async () => {
        if (workFlow) {
            try {
                await saveWorkflowAction(id, {
                    nodes: JSON.stringify(nodes),
                    edges: JSON.stringify(edges),
                    nodeDataArr: JSON.stringify(getNodesData()),
                });
                onSaved(id, {
                    nodes,
                    edges,
                    nodeDataArr: getNodesData(),
                });
            } catch (error) {
                console.error("Error saving workflow:", error);
                toast.error("Failed to save workflow");
            }
        }
    }, [workFlow, id, nodes, edges, getNodesData, onSaved]);

    const debouncedSaveWorkflow = useCallback(() => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
            saveWorkflow();
        }, DEBOUNCE_DELAY);
    }, [saveWorkflow]);

    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    return { saveWorkflow: debouncedSaveWorkflow };
};

export default useSaveWorkflowToLocal;
