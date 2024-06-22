import type { NodeData } from "@/types/types";
import { produce } from "immer";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type Storetype = {
  nodeDataArr: NodeData[];
  getSingleData: (id: string) => NodeData | undefined;
  setNodeData: (data: NodeData) => void;
  removeNodeData: (id: string) => void;
  getNodesData: () => NodeData[];
  setNodesData: (data: NodeData[]) => void;
};

export const useNodeDataStore = create<Storetype>()(
  devtools(
    immer((set, get) => ({
      nodeDataArr: [],
      setNodeData: (newData) =>
        set(
          produce((state: Storetype) => {
            const nodeIndex = state.nodeDataArr.findIndex(
              (data) => data.id === newData.id
            );
            if (nodeIndex !== -1) {
              state.nodeDataArr[nodeIndex] = newData;
            } else {
              state.nodeDataArr.push(newData);
            }
          })
        ),
      getSingleData: (id) => {
        const data = get().nodeDataArr;
        return data.find((node) => node.id === id);
      },
      removeNodeData: (id) =>
        set(
          produce((state: Storetype) => {
            state.nodeDataArr = state.nodeDataArr.filter(
              (node) => node.id !== id
            );
          })
        ),
      getNodesData: () => get().nodeDataArr,
      setNodesData: (data) =>
        set(
          produce((state: Storetype) => {
            state.nodeDataArr = data;
          })
        ),
    })),
    {
      enabled: true,
      name: "node-data",
    }
  )
);
