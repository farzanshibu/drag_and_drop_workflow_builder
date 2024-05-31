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

type NodeData = {
  id: string;
  data_target: any | undefined;
  data_source: any | undefined;
  field?: FieldTypes;
};

interface statData {
  sum: number;
  mean: number;
  min: number;
  max: number;
  median: number;
  mode: string;
  modeCount: any;
  variance: number;
  stdDev: number;
}

type FieldTypes = {
  inputSelectedFile?: File | undefined;
  exampleSelectedOption?: string | undefined;
  transformSelectedOption?: string | undefined;
  transformSelectedCondition?: string | undefined;
  transformSelectedGroup?: string | undefined;
  transformIndexStart?: number | undefined;
  transformIndexEnd?: number | undefined;
  transformSortConditions?: string | undefined;
  transformColumnName?: string | undefined;
  transformColumnName2?: string | undefined;
  chartColumnName?: string | undefined;
  chartColumnName2?: string | undefined;
  miscSelectedColumn?: string | undefined;
  miscStatData?: statData | undefined;
  micsMarkupShow?: boolean | undefined;
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
