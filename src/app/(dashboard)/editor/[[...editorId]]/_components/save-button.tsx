"use client";

import { Button } from "@/components/ui/button";
import { useNodeDataStore } from "@/store/node-data";
import { useWorkflowStore } from "@/store/workflows";
import { LucideLoader2, Save } from "lucide-react";
import { useTransition } from "react";
import { useEdges, useNodes } from "reactflow";
import { toast } from "sonner";
import { saveWorkflowAction } from "../_actions/workflow-action";

export default function SaveButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const getNodesData = useNodeDataStore((state) => state.getNodesData);
  const { getSingleWorkFlow, onSaved } = useWorkflowStore((state) => ({
    getSingleWorkFlow: state.getSingleWorkFlow,
    onSaved: state.onSaved,
  }));

  const nodes = useNodes();
  const edges = useEdges();

  async function onSavetoDB() {
    startTransition(async () => {
      try {
        await saveWorkflowAction(id, {
          nodes: JSON.stringify(nodes),
          edges: JSON.stringify(edges),
          nodeDataArr: JSON.stringify(getNodesData()),
        });
        onSaved(id, {
          nodes,
          edges,
          nodeDataArr: getNodesData(),
        });

        toast.success("Saved Successfully");
      } catch (error) {
        console.error("Error saving workflow:", error);
        toast.error("Failed to save workflow");
      }
    });
  }

  return (
    <Button
      onClick={async () => {
        startTransition(() => {
          onSavetoDB();
        });
      }}
      className="text-green-400 bg-green-500/20 border border-green-500 hover:bg-green-700 hover:text-white relative"
    >
      <Save size={16} />
      <span className="hidden lg:block lg:ml-3">
        {isPending ? (
          <div className="flex items-center gap-1">
            Saving
            <LucideLoader2 size={16} color="lime" className="animate-spin" />
          </div>
        ) : (
          "Save"
        )}
      </span>
    </Button>
  );
}
