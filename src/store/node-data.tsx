import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type Storetype = {
  nodeDataArr: NodeData[];
  setNodeData: (data: NodeData) => void;
  getSingleData: (id: string) => NodeData | undefined;
  getNodesData: () => NodeData[];
  setNodesData: (data: NodeData[]) => void;
};
type NodeData = {
  id: string;
  data_target: any | undefined;
  data_source: any | undefined;
};

export const useNodeDataStore = create<Storetype>()(
  devtools(
    immer((set, get) => ({
      nodeDataArr: [] as NodeData[],
      setNodeData: (newData) =>
        set((state) => {
          const nodeIndex = state.nodeDataArr.findIndex(
            (data) => data.id === newData.id
          );
          if (nodeIndex !== -1) {
            state.nodeDataArr[nodeIndex] = newData;
          } else {
            state.nodeDataArr.push(newData);
          }
        }),
      getSingleData: (id) => {
        const data: NodeData[] = useNodeDataStore.getState().nodeDataArr;
        return data.find((node) => node.id === id);
      },
      getNodesData: () => get().nodeDataArr,
      setNodesData: (data: NodeData[]) =>
        set((state) => {
          state.nodeDataArr = data;
        }),
    }))
  )
);
mountStoreDevtool("Node Data Store", useNodeDataStore);
