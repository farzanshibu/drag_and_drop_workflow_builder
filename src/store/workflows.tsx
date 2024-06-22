import type { NodeData, WorkFlow } from "@/types/types";
import { produce } from "immer";
import type { Edge, Node } from "reactflow";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
type Storetype = {
  workFlow: WorkFlow[];
  updateWorkFlow: (id: string, data: WorkFlow) => void;
  deleteWorkFlow: (id: string) => void;
  createWorkFlow: (data: {
    workflowId: string;
    workflowName: string;
    workflowDescription: string;
    clerkId: string;
  }) => void;
  getSingleWorkFlow: (id: string) => WorkFlow | undefined;
  upadateSingleWorkFlowName: (id: string, data: string) => void;
  upadateSingleWorkFlowDescription: (id: string, data: string) => void;
  getWorkFlow: () => WorkFlow[];
  setWorkFlow: (data: WorkFlow[]) => void;
  onSaved: (
    id: string,
    data: {
      nodes: Node[];
      edges: Edge[];
      nodeDataArr: NodeData[];
    }
  ) => void;
};

export const useWorkflowStore = create<Storetype>()(
  devtools(
    persist(
      immer((set, get) => ({
        workFlow: [],
        updateWorkFlow: (id: string, data: WorkFlow) =>
          set(
            produce((state: Storetype) => {
              const index = state.workFlow.findIndex((flow) => flow.id === id);
              if (index !== -1) {
                state.workFlow[index] = data;
              }
            })
          ),
        deleteWorkFlow: (id: string) =>
          set(
            produce((state: Storetype) => {
              state.workFlow = state.workFlow.filter((flow) => flow.id !== id);
            })
          ),
        createWorkFlow: (data: {
          workflowId: string;
          workflowName: string;
          workflowDescription: string;
          clerkId: string;
        }) =>
          set(
            produce((state: Storetype) => {
              const newWorkFlow: WorkFlow = {
                id: data.workflowId,
                name: data.workflowName,
                description: data.workflowDescription,
                last_updated: new Date().toISOString(),
                clerkid: data.clerkId,
                nodes: [],
                edges: [],
                nodeDataArr: [],
              };
              state.workFlow.push(newWorkFlow);
            })
          ),
        getSingleWorkFlow: (id: string) => {
          const workFlow = get().workFlow;
          return workFlow.find((flow) => flow.id === id);
        },
        upadateSingleWorkFlowName: (id: string, data: string) =>
          set(
            produce((state: Storetype) => {
              const index = state.workFlow.findIndex((flow) => flow.id === id);
              if (index !== -1) {
                state.workFlow[index].name = data;
              }
            })
          ),
        upadateSingleWorkFlowDescription: (id: string, data: string) =>
          set(
            produce((state: Storetype) => {
              const index = state.workFlow.findIndex((flow) => flow.id === id);
              if (index !== -1) {
                state.workFlow[index].description = data;
              }
            })
          ),
        getWorkFlow: () => get().workFlow,
        setWorkFlow: (data: WorkFlow[]) =>
          set(
            produce((state: Storetype) => {
              state.workFlow = data;
            })
          ),
        onSaved: (id, data) =>
          set(
            produce((state: Storetype) => {
              const index = state.workFlow.findIndex((flow) => flow.id === id);
              if (index !== -1) {
                state.workFlow[index].last_updated = new Date().toISOString();
                state.workFlow[index].nodes = data.nodes;
                state.workFlow[index].edges = data.edges;
                state.workFlow[index].nodeDataArr = data.nodeDataArr;
              }
            })
          ),
      })),
      {
        name: "workflow-storage", // name of the item in the storage
        storage: createJSONStorage(() => localStorage), // create a storage instance
        skipHydration: true,
      }
    ),
    {
      enabled: true,
      name: "workflow",
    }
  )
);
