"use client";

import Spinner from "@/components/global/spinner";
import { parseWorkflows } from "@/lib/utils";
import { useWorkflowStore } from "@/store/workflows";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchWorkflows } from "../_fetch/fetch-call";
import WorkFlowCard from "./workflow-card";

type Props = {};

export default function ListWorkFlow({}: Props) {
  const { getWorkFlow, setWorkFlow } = useWorkflowStore((state) => ({
    getWorkFlow: state.getWorkFlow,
    setWorkFlow: state.setWorkFlow,
  }));

  const [isLoading, setIsLoading] = useState(true);

  const { data } = useQuery({
    queryKey: ["worksflows"],
    queryFn: fetchWorkflows,
    enabled: true,
  });

  useEffect(() => {
    const loadWorkflows = () => {
      setIsLoading(true);
      const localWorkflows = getWorkFlow();

      if (localWorkflows.length > 0) {
        setWorkFlow(localWorkflows);
      } else {
        fetchFromAPI();
      }
      setIsLoading(false);
    };

    const fetchFromAPI = () => {
      if (data) {
        const workflows = parseWorkflows(data);
        setWorkFlow(workflows);
      }
    };

    loadWorkflows();
  }, [setWorkFlow, data, getWorkFlow]);

  const workFlows = getWorkFlow();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      {workFlows.length === 0 ? (
        <div className="w-screen h-screen flex justify-center items-center">
          <p className="text-slate-400">No WorkFlow Found</p>
        </div>
      ) : (
        <div className="w-full xl:w-5/6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 justify-center">
          {workFlows.map((workflow) => (
            <WorkFlowCard
              key={workflow.id}
              lastUpdated={workflow.last_updated || new Date().toISOString()}
              workflowId={workflow.id}
              workflowName={workflow.name || "Untitled"}
              workflowDescription={workflow.description || ""}
            />
          ))}
        </div>
      )}
    </>
  );
}
