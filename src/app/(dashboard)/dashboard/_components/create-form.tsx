import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { useWorkflowStore } from "@/store/workflows";
import { toast } from "sonner";

export const formSchema = z.object({
  workflowName: z.string().min(4).max(24),
});
type Props = {
  onOpenChange: (open: boolean) => void;
};

export default function CreateForm({ onOpenChange }: Props) {
  const createWorkFlow = useWorkflowStore((state) => state.createWorkFlow);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  //TODO: server action to create a new workflow
  function onSubmit(values: z.infer<typeof formSchema>) {
    createWorkFlow(values.workflowName);
    toast.success("WorkFlow Created");
    onOpenChange(false);
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="workflowName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WorkFlow</FormLabel>
              <FormControl>
                <Input placeholder="WorkFlow Name" type="text" {...field} />
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
            className="text-lime-400 bg-lime-500/20 border border-lime-500 hover:bg-lime-700 hover:text-white"
          >
            Create
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
