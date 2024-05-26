"use client";

import { useWorkflowStore } from "@/store/workflows";
import WorkFlowCard from "./workflow-card";

type Props = {};

export default function ListWorkFlow({}: Props) {
  const getWorkFlow = useWorkflowStore((state) => state.getWorkFlow());

  return (
    <>
      {getWorkFlow.length === 0 ? (
        <div className="w-full h-screen flex justify-end items-center">
          <p className="text-slate-400">No WorkFlow Found</p>
        </div>
      ) : null}
      <div className="w-full xl:w-5/6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 justify-center">
        {getWorkFlow.length !== 0
          ? getWorkFlow.map((workflow) => (
              <WorkFlowCard
                key={workflow.id}
                lastUpdated={workflow.last_updated}
                workflowId={workflow.id}
                workflowName={workflow.name}
              />
            ))
          : null}
      </div>
    </>
  );
}
