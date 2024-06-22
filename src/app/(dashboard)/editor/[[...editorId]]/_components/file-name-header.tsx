"use client";

import { useWorkflowStore } from "@/store/workflows";
import { ChevronRight } from "lucide-react";
import DescriptionEditorInput from "./description-editor-input";
import NameEditorInput from "./name-editor-input";

export default function FileNameHeader({ id }: { id: string }) {
  const { getSingleWorkFlow } = useWorkflowStore((state) => ({
    getSingleWorkFlow: state.getSingleWorkFlow,
  }));
  const workFlow = getSingleWorkFlow(id);
  if (!workFlow) {
    return null;
  }
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <NameEditorInput filename={workFlow.name} workflowId={workFlow.id} />
        <p className="text-slate-100/15 hidden lg:block text-xs">
          {workFlow.id}
        </p>
      </div>
      <ChevronRight className="text-slate-100/45 hidden lg:block" size={24} />
      <div className="flex flex-col items-center justify-center">
        <DescriptionEditorInput
          filename={workFlow.description}
          workflowId={workFlow.id}
        />
        <p className="text-slate-100/15 hidden lg:block text-xs">
          {new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(workFlow.last_updated))}
        </p>
      </div>
    </>
  );
}
