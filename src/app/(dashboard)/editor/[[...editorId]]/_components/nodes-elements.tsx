import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { NodesTypes } from "@/lib/constants";
import { useState } from "react";
import { useReactFlow } from "reactflow";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

type AddBlockProps = {
  id: number;
  name: string;
  description: string;
  input: null | string;
  output: null | string;
  type: string;
  data: {};
};

export default function NodesElement() {
  const { setNodes } = useReactFlow();
  const [search, setSearch] = useState("");

  const handleAddBlock = (element: AddBlockProps) => () => {
    toast.success("Block Added");
    setNodes((nodes) => [
      ...nodes,
      {
        id: uuidv4(),
        type: element.type,
        data: {},
        position: { x: 250, y: 250 },
      },
    ]);
  };
  return (
    <div className="flex flex-col h-dvh my-3">
      <Input
        placeholder="Search Block Elements"
        value={search}
        onChange={(letter) => {
          setSearch(letter.target.value);
        }}
        className="mb-3"
      />
      <div className="mt-3 flex-1 overflow-y-auto">
        {NodesTypes.map((node, index) => {
          const filteredElements = node.elements.filter((element) =>
            element.name.toLowerCase().includes(search.toLowerCase())
          );
          if (filteredElements.length === 0) {
            return null;
          }
          return (
            <div key={node.id} className="flex flex-col gap-2 mt-3">
              <h3 className="text-left">{node.type}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                {filteredElements.map((element) => {
                  return (
                    <div
                      onClick={handleAddBlock(element)}
                      key={element.id}
                      className="flex flex-col justify-between hover:bg-slate-200 dark:hover:bg-slate-800  gap-1 p-2 rounded-md border border-gray-300 cursor-pointer"
                    >
                      <div>
                        <h4 className="text-left">{element.name}</h4>
                        <p className="text-left text-[12px] text-slate-400">
                          {element.description}
                        </p>
                      </div>
                      <div className="flex flex-col">
                        {element.input ? (
                          <span className="text-left text-[10px] dark:text-slate-100">
                            Input: {element.input}
                          </span>
                        ) : null}
                        {element.output ? (
                          <span className="text-left text-[10px] dark:text-slate-100">
                            Output: {element.output}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
              <Separator className="my-2" />
              {index === NodesTypes.length - 1 ? (
                <div className="h-40"></div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
