import { useNodeDataStore } from '@/store/node-data';
import { useMemo } from 'react';
import { useReactFlow } from 'reactflow';

const useNodeData = (currentNodeId: string, sourceNodeID?: string, sourceNodeIDB?: string) => {
    const { setNodes } = useReactFlow();
    const { removeNodeData, getSingleData } = useNodeDataStore((state) => (
        {
            removeNodeData: state.removeNodeData,
            getSingleData: state.getSingleData,
        }
    ));


    return useMemo(() => {
        const handleRemoveBlock = () => {
            setNodes((nodes) => nodes.filter((n) => n.id !== currentNodeId));
            removeNodeData(currentNodeId);

        };
        let lastNodeDataSource = [];
        let lastNodeDataSourceB = [];
        let lastNodeDataTarget = [];
        let lastNodeDataTargetB = [];

        if (sourceNodeID) {
            const sourceNodeData = getSingleData(sourceNodeID);
            lastNodeDataSource = sourceNodeData?.data_source || [];
            lastNodeDataTarget = sourceNodeData?.data_target || [];
        }
        if (sourceNodeIDB) {
            const sourceNodeDataB = getSingleData(sourceNodeIDB);
            lastNodeDataSourceB = sourceNodeDataB?.data_source || [];
            lastNodeDataTargetB = sourceNodeDataB?.data_target || [];
        }

        return {
            lastNodeDataSource,
            lastNodeDataSourceB,
            lastNodeDataTarget,
            lastNodeDataTargetB,
            handleRemoveBlock,
        };
    }, [currentNodeId, sourceNodeID, sourceNodeIDB, getSingleData, setNodes, removeNodeData]);
};

export default useNodeData;
