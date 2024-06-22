"use client";
import { deleteWorkflowAction } from "@/app/(dashboard)/dashboard/_actions/workflow-actions";
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
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  workflowId: string;
};

export default function DeleteWorkFlowButton({ workflowId }: Props) {
  const deleteWorkFlow = useWorkflowStore((state) => state.deleteWorkFlow);
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteAction = async (workflowId: string) => {
    try {
      const res = await deleteWorkflowAction(workflowId);
      if (res.status === "success") {
        deleteWorkFlow(workflowId);
        queryClient.invalidateQueries({ queryKey: ["workflows"] });
        toast.success("Workflow Deleted");
        router.push("/dashboard");
      } else {
        throw new Error(
          res.message || "An error occurred while deleting workflow"
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="text-red-400 bg-red-500/20 border border-red-500 hover:bg-red-700 hover:text-white">
          <Trash2 size={16} />
          <span className="ml-3">Delete</span>
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
              onClick={() => deleteAction(workflowId)}
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
