"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useWorkflowStore } from "@/store/workflows";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  workflowId: string;
};

export default function DeleteWorkFlowButton({ workflowId }: Props) {
  const deleteWorkFlow = useWorkflowStore((state) => state.deleteWorkFlow);
  const router = useRouter();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="text-red-400 bg-red-500/20 border border-red-500 hover:bg-red-700 hover:text-white">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            Workflow and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={() => {
                deleteWorkFlow(workflowId);
                toast.success("WorkFlow Deleted");
                router.push("/dashboard");
              }}
              className="text-red-400 bg-red-500/20 border border-red-500 hover:bg-red-700 hover:text-white"
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
