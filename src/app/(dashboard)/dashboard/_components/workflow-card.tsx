import DeleteWorkFlowButton from "@/components/global/delete-workflow-button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, RefreshCcw } from "lucide-react";

import Link from "next/link";

type Props = {
  workflowName: string;
  workflowId: string;
  lastUpdated: string;
};

export default function WorkFlowCard({
  workflowName,
  workflowId,
  lastUpdated,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">
          {workflowName.toLowerCase()}
        </CardTitle>
        <CardDescription className="italic">{workflowId}</CardDescription>
      </CardHeader>
      <CardFooter>
        <div className="flex w-full lg:items-center justify-between flex-col lg:flex-row">
          <p className="text-slate-400 text-xs flex gap-2">
            <RefreshCcw size={16} />
            <span className="font-medium text-slate-200">
              {new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(lastUpdated))}
            </span>
          </p>
          <div className="flex gap-2 flex-col lg:flex-row mt-5 lg:mt-0">
            <Link
              className="ml-3  inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2 px-4  text-green-400 bg-green-500/20 border border-green-500 hover:bg-green-700 hover:text-white "
              href={`/editor/${workflowId}`}
            >
              <Eye size={16} />
              View
            </Link>

            <DeleteWorkFlowButton workflowId={workflowId} />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
