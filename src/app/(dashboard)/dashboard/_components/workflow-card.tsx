import DeleteWorkFlowButton from "@/components/global/delete-workflow-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
        <div className="flex w-full items-center justify-between">
          <p className="text-slate-400 text-xs">
            Last Updated on :{" "}
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
          <div className="flex gap-2">
            <Button className="text-green-400 bg-green-500/20 border border-green-500 hover:bg-green-700 hover:text-white">
              <Link href={`/editor/${workflowId}`}>View</Link>
            </Button>
            <DeleteWorkFlowButton workflowId={workflowId} />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
