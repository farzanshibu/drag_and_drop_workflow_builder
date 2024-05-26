"use client";
import { formSchema } from "@/app/(dashboard)/dashboard/_components/create-form";
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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  filename: string;
  workflowId: string;
};

export default function NameEditorInput({ filename, workflowId }: Props) {
  const { upadateSingleWorkFlowName } = useWorkflowStore((state) => ({
    upadateSingleWorkFlowName: state.upadateSingleWorkFlowName,
  }));

  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workflowName: filename,
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsEditing(false);
    upadateSingleWorkFlowName(workflowId, values.workflowName);
    console.log(values);
  }
  return isEditing ? (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex">
        <FormField
          control={form.control}
          name="workflowName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Filename" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  ) : (
    <h6
      onDoubleClick={handleDoubleClick}
      className="text-slate-100/45 capitalize"
    >
      {filename}
    </h6>
  );
}
