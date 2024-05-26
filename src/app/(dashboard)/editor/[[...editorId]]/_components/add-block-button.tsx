import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import NodesElement from "./nodes-elements";
type Props = {};

export default function AddBlockButton({}: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className=" bg-orange-500/40 border border-orange-500 hover:bg-orange-700 text-white backdrop-blur-2xl">
          <Plus />
          Add Block
          <div className="text-sm text-muted-foreground">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded px-1.5 font-mono text-[10px] font-medium text-white opacity-100">
              <span className="text-xs">⌘ </span>
              <h1 className="text-sm">J</h1>
            </kbd>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>Add Blocks</SheetTitle>
          <SheetDescription>
            These are the blocks you can add to your workflow
          </SheetDescription>
          <NodesElement />
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
