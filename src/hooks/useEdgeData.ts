import { useNodeStore } from '@/store/nodes';

export const useEdgeData = (edgeId: string) => {
    const { sourceIds, targetIds } = useNodeStore();
    const sourceId = sourceIds.find((id) => id === edgeId);
    const targetId = targetIds.find((id) => id === edgeId);

    return { sourceId, targetId };
};