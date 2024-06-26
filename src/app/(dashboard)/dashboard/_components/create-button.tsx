"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateForm from "./create-form";

type Props = {};

export default function CreateNewWorkFlowButton({}: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-sky-400 bg-sky-500/20 border border-sky-500 hover:bg-sky-700 hover:text-white">
          <Plus className="h-5 w-5" />
          <span className="hidden lg:block lg:ml-2">Create New WorkFlow</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a New WorkFlow</DialogTitle>
          <DialogDescription>
            Enter the name of the WorkFlow you want to create
          </DialogDescription>
        </DialogHeader>
        <CreateForm onOpenChange={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
