"use client";

import { ModeToggle } from "@/components/global/mode-toggle";
import CreateNewWorkFlowButton from "./_components/create-button";
import ListWorkFlow from "./_components/list-workflow";

export default function Dashboard() {
  return (
    <div className="px-16 flex flex-col gap-2 relative p-5 rounded-tl-3xl h-screen ">
      <div className="flex justify-between">
        <div className="">
          <h1 className="text-3xl mb-2">DashBoard</h1>
          <p className="text-sm text-slate-400">
            Welcome to the WorkFlow Builder Dashboard
          </p>
        </div>
        <div className="flex gap-2">
          <CreateNewWorkFlowButton />
          <ModeToggle />
          {/*  TODO: User Profile Dropdown */}
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <ListWorkFlow />
      </div>
    </div>
  );
}
