import Spinner from "@/components/global/spinner";
import CustomUserButton from "@/components/global/user-button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { currentUser } from "@clerk/nextjs/server";
import { QueryClient } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import BackButton from "./_components/back-button";
import FileNameHeader from "./_components/file-name-header";
import LogsContainer from "./_components/logs";
import MenuToolBar from "./_components/menu-toolbar";
import OutputContainer from "./_components/output";
import ReactFlowContainer from "./_components/reactflow";
import SaveButton from "./_components/save-button";
import { fetchWorkflows } from "./_fetch/fetch-call";

export default async function Editor({
  params,
}: {
  params: { editorId: string };
}) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["worksflows"],
    queryFn: fetchWorkflows,
  });

  return (
    <div className="lg:px-16 flex flex-col gap-2 relative p-5 rounded-tl-3xl h-screen ">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <h1 className="text-3xl mb-2">Editor</h1>
          <MenuToolBar />
        </div>
        <div className="flex items-center gap-3">
          <FileNameHeader id={params.editorId[0]} />
        </div>
        <div className="flex gap-2 items-start">
          <BackButton />
          <SaveButton id={params.editorId[0]} />
          <CustomUserButton />
        </div>
      </div>
      <Suspense fallback={<Spinner />}>
        <ResizablePanelGroup
          direction="vertical"
          className="mt-3 max-w-full rounded-lg border select-none"
        >
          <ResizablePanel defaultSize={65}>
            <ReactFlowContainer id={params.editorId[0]} />
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
      </Suspense>
    </div>
  );
}
