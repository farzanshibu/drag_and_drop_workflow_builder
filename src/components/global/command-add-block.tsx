"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { NodesTypes } from "@/lib/constants";
import { useEffect, useState } from "react";
import { useReactFlow } from "reactflow";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../ui/button";

type AddBlockProps = {
  id: number;
  name: string;
  description: string;
  input: null | string;
  output: null | string;
  type: string;
  data: {};
};

export function CommandDialogBlock() {
  const { setNodes } = useReactFlow();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleAddBlock = (element: AddBlockProps) => () => {
    console.log("Add block");
    setNodes((nodes) => [
      ...nodes,
      {
        id: uuidv4(),
        type: element.type,
        data: { label: element.name },
        position: { x: 250, y: 250 },
      },
    ]);
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {NodesTypes.map((node) => (
          <div key={node.id}>
            <CommandGroup heading={node.type}>
              {node.elements.map((element) => (
                <CommandItem key={element.id}>
                  <Button
                    variant="ghost"
                    className="text-left w-full p-0 flex items-center justify-start h-5"
                    onClick={handleAddBlock(element)}
                  >
                    {element.name}
                  </Button>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
