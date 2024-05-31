"use client";

import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useNodeDataStore } from "@/store/node-data";
import { useWorkflowStore } from "@/store/workflows";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useEdges, useNodes } from "reactflow";
import { toast } from "sonner";
import LogsContainer from "./_components/logs";
import MenuToolBar from "./_components/menu-toolbar";
import NameEditorInput from "./_components/name-editor-input";
import OutputContainer from "./_components/output";
import ReactFlowContainer from "./_components/reactflow";

export default function Editor({ params }: { params: { editorId: string } }) {
  const router = useRouter();
  if (!params.editorId) {
    redirect("/dashboard");
  }
  const { onSaved, getSingleWorkFlow } = useWorkflowStore((state) => ({
    onSaved: state.onSaved,
    getSingleWorkFlow: state.getSingleWorkFlow,
  }));
  const workFlow = getSingleWorkFlow(params.editorId[0]);

  if (!workFlow) {
    redirect("/dashboard");
  }
  const nodes = useNodes();
  const edges = useEdges();
  const getNodesData = useNodeDataStore((state) => state.getNodesData);
  const setNodesData = useNodeDataStore((state) => state.setNodesData);
  useEffect(() => {
    if (workFlow.nodeDataArr.length > 0) {
      setNodesData(workFlow.nodeDataArr);
    }
  }, [workFlow.nodeDataArr, setNodesData]);

  return (
    <div className="lg:px-16 flex flex-col gap-2 relative p-5 rounded-tl-3xl h-screen ">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <h1 className="text-3xl mb-2">Editor</h1>
          <MenuToolBar />
        </div>
        <div className="flex items-center gap-3">
          <h3 className="text-slate-100/45 hidden lg:block ">
            {params.editorId}
          </h3>
          <ChevronRight
            className="text-slate-100/45 hidden lg:block"
            size={16}
          />
          <NameEditorInput
            filename={workFlow?.name}
            workflowId={workFlow?.id}
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              router.push("/dashboard");
            }}
            className="text-violet-400 bg-violet-500/20 border border-violet-500 hover:bg-violet-700 hover:text-white"
          >
            <ChevronLeft size={16} />
            <span className="hidden lg:block lg:ml-3">Back</span>
          </Button>
          <Button
            onClick={() => {
              onSaved(workFlow?.id, {
                nodes,
                edges,
                nodeDataArr: getNodesData(),
              });
              toast.success("Saved Successfully");
            }}
            className="text-green-400 bg-green-500/20 border border-green-500 hover:bg-green-700 hover:text-white"
          >
            <Save size={16} />
            <span className="hidden lg:block lg:ml-3">Save</span>
          </Button>

          {/*  TODO: User Profile Dropdown */}
        </div>
      </div>
      <ResizablePanelGroup
        direction="vertical"
        className="mt-3 max-w-full rounded-lg border select-none"
      >
        <ResizablePanel defaultSize={65}>
          <ReactFlowContainer
            initialNodes={workFlow.nodes}
            initialEdges={workFlow.edges}
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={35}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={75}>
              <OutputContainer />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={25} className="hidden">
              <LogsContainer />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
