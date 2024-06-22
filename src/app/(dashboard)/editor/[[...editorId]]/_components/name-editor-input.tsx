"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useWorkflowStore } from "@/store/workflows";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOptimistic, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { updateWorkflowNameAction } from "../_actions/workflow-action";

type Props = {
  filename: string;
  workflowId: string;
};

const formSchema = z.object({ workflowName: z.string().min(4).max(24) });

export default function NameEditorInput({ filename, workflowId }: Props) {
  const { upadateSingleWorkFlowName } = useWorkflowStore((state) => ({
    upadateSingleWorkFlowName: state.upadateSingleWorkFlowName,
  }));

  const [fileNameOpt, addOptFileName] = useOptimistic(
    filename,
    (prev, newValue: string) => newValue
  );

  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workflowName: fileNameOpt,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    addOptFileName(values.workflowName);
    setIsEditing(false);
    const res = await updateWorkflowNameAction(workflowId, values.workflowName);
    if (res.status === "error") {
      console.error(res.error);
      toast.error(res.message);
    }
    if (res.status === "success") {
      toast.success(res.message);
      upadateSingleWorkFlowName(workflowId, values.workflowName);
    }
  };

  return isEditing ? (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex">
        <FormField
          control={form.control}
          name="workflowName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Filename"
                  {...field}
                  className="rounnded-r-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="text-amber-400 bg-amber-500/20 border border-amber-500 hover:bg-amber-700 hover:text-white rounded-l-none"
        >
          Save
        </Button>
      </form>
    </Form>
  ) : (
    <h6
      onDoubleClick={handleDoubleClick}
      className="text-slate-100/45 capitalize"
    >
      {fileNameOpt}
    </h6>
  );
}
