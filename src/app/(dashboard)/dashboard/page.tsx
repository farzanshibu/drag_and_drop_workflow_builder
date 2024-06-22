import { ModeToggle } from "@/components/global/mode-toggle";
import CustomUserButton from "@/components/global/user-button";
import { currentUser } from "@clerk/nextjs/server";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import CreateNewWorkFlowButton from "./_components/create-button";
import ListWorkFlow from "./_components/list-workflow";
import { fetchWorkflows } from "./_fetch/fetch-call";

export default async function Dashboard() {
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
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl mb-2">DashBoard</h1>
          <p className="text-sm text-slate-400">
            Welcome to the WorkFlow Builder Dashboard
          </p>
        </div>
        <div className="flex gap-2 items-start">
          <CreateNewWorkFlowButton />
          <ModeToggle />
          <CustomUserButton />
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ListWorkFlow />
        </HydrationBoundary>
      </div>
    </div>
  );
}
