import type { Edge, Node } from "reactflow";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type Storetype = {
  workFlow: WorkFlow[];
  updateWorkFlow: (id: string, data: WorkFlow) => void;
  deleteWorkFlow: (id: string) => void;
  createWorkFlow: (data: string) => void;
  getSingleWorkFlow: (id: string) => WorkFlow | undefined;
  upadateSingleWorkFlowName: (id: string, data: string) => void;
  getWorkFlow: () => WorkFlow[];
  onSaved: (
    id: string,
    data: {
      nodes: Node[];
      edges: Edge[];
      nodeDataArr: NodeData[];
    }
  ) => void;
};

type NodeData = {
  id: string;
  data_target: any | undefined;
  data_source: any | undefined;
};

interface WorkFlow {
  id: string;
  name: string;
  last_updated: string;
  nodes: Node[];
  edges: Edge[];
  nodeDataArr: NodeData[];
}

export const useWorkflowStore = create<Storetype>()(
  devtools(
    immer((set, get) => ({
      workFlow: [],
      updateWorkFlow: (id: string, data: WorkFlow) =>
        set((state) => {
          const index = state.workFlow.findIndex((flow) => flow.id === id);
          if (index !== -1) {
            state.workFlow[index] = data;
          }
        }),
      deleteWorkFlow: (id: string) =>
        set((state) => {
          state.workFlow = state.workFlow.filter((flow) => flow.id !== id);
        }),
      createWorkFlow: (data: string) =>
        set((state) => {
          const newWorkFlow: WorkFlow = {
            id: crypto.randomUUID(),
            name: data,
            last_updated: new Date().toISOString(),
            nodes: [],
            edges: [],
            nodeDataArr: [],
          };
          state.workFlow.push(newWorkFlow);
        }),
      getSingleWorkFlow: (id: string) => {
        const workFlow = get().workFlow;
        return workFlow.find((flow) => flow.id === id);
      },
      upadateSingleWorkFlowName: (id: string, data: string) =>
        set((state) => {
          const index = state.workFlow.findIndex((flow) => flow.id === id);
          if (index !== -1) {
            state.workFlow[index].name = data;
          }
        }),
      getWorkFlow: () => get().workFlow,
      onSaved: (id: string, data) =>
        set((state) => {
          const index = state.workFlow.findIndex((flow) => flow.id === id);
          if (index !== -1) {
            state.workFlow[index].last_updated = new Date().toISOString();
            state.workFlow[index].nodes = data.nodes;
            state.workFlow[index].edges = data.edges;
            state.workFlow[index].nodeDataArr = data.nodeDataArr;
          }
        }),
    }))
  )
);
