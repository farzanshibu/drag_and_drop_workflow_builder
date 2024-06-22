import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useWorkflowStore } from "@/store/workflows";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { LucideLoader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createWorkflowAction } from "../_actions/workflow-actions";

const formSchema = z.object({
  workflowId: z
    .string()
    .uuid()
    .default(() => crypto.randomUUID()),
  workflowName: z.string().min(4).max(24),
  workflowDescription: z.string().min(4),
});
type Props = {
  onOpenChange: (open: boolean) => void;
};

export default function CreateForm({ onOpenChange }: Props) {
  const createWorkFlow = useWorkflowStore((state) => state.createWorkFlow);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { formState } = form;
  const { isSubmitting } = formState;
  const queryClient = useQueryClient();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let newWorkflow = await createWorkflowAction(values);
    if (newWorkflow.status === "error") {
      return toast.error(newWorkflow.message);
    }
    queryClient.invalidateQueries({ queryKey: ["workflows"] });
    toast.success(newWorkflow.message);
    let data = {
      workflowId: newWorkflow.workflow!.id,
      workflowName: newWorkflow.workflow!.name,
      workflowDescription: newWorkflow.workflow!.description,
      workflowUpdated: newWorkflow.workflow!.last_updated,
      clerkId: newWorkflow.workflow!.clerkid,
    };
    createWorkFlow(data);

    onOpenChange(false);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="workflowName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WorkFlow Name</FormLabel>
              <FormControl>
                <Input placeholder="WorkFlow Name" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="workflowDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WorkFlow Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="WorkFlow Description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="gap-4 sm:justify-start lg:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="text-lime-400 bg-lime-500/20 border border-lime-500 hover:bg-lime-700 hover:text-white"
          >
            {isSubmitting ? (
              <LucideLoader size={24} color="lime" className="animate-spin" />
            ) : (
              "Create"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
