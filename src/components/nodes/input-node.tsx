"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useNodeData from "@/hooks/useNodeData";
import { ObjectStats } from "@/lib/utils";
import { useTableDataStore } from "@/store/table";
import { Sheet, X } from "lucide-react";
import Papa from "papaparse";
import { useCallback, useEffect, useRef, useState } from "react";
import { Position } from "reactflow";
import { toast } from "sonner";
import { useNodeDataStore } from "../../store/node-data";
import CustomHandle from "../global/custom-handle";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function InputFileNode({ id }: { id: string }) {
  const setTableData = useTableDataStore((state) => state.setTableData);
  const { getSingleData, setNodeData } = useNodeDataStore((state) => ({
    getSingleData: state.getSingleData,
    setNodeData: state.setNodeData,
  }));
  const inputFile = useRef<HTMLInputElement>(null);
  const { handleRemoveBlock } = useNodeData(id);

  const [selectedOption, setSelectedOption] = useState<File | undefined>();

  const handleFileRemove = () => {
    setSelectedOption(undefined);
    setNodeData({
      id,
      data_target: undefined,
      data_source: undefined,
      field: { inputSelectedFile: undefined },
    });
  };

  const handleFileOpen = () => {
    if (inputFile.current) {
      inputFile.current.click();
    }
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (event) => {
        const file = event.target.files?.[0];
        if (!file) {
          toast.error("No file selected");
          return;
        }
        if (file.type !== "application/json" && file.type !== "text/csv") {
          toast.error("Invalid file type");
          return;
        }
        if (file.size > 1024 * 1024 * 5) {
          toast.error("File too large");
          return;
        }
        setSelectedOption(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result;
          if (file.type === "application/json") {
            const json = JSON.parse(content as string);
            setNodeData({
              id,
              data_target: json,
              data_source: file,
              field: { inputSelectedFile: file },
            });
          } else if (file.type === "text/csv") {
            Papa.parse(content as string, {
              header: true,
              complete: (result) => {
                setNodeData({
                  id,
                  data_target: result.data,
                  data_source: file,
                  field: { inputSelectedFile: file },
                });
              },
            });
          }
        };
        reader.readAsText(file);
      },
      [id, setNodeData]
    );

  useEffect(() => {
    const initialSelectedFile = getSingleData(id)?.field?.inputSelectedFile;
    if (initialSelectedFile) {
      const dt = new DataTransfer();
      const blob = new Blob([initialSelectedFile], {
        type: initialSelectedFile.type,
      });
      const file = new File([blob], initialSelectedFile.name, {
        type: initialSelectedFile.type,
      });
      dt.items.add(file);
      handleFileChange({
        target: { files: dt.files } as HTMLInputElement,
      } as React.ChangeEvent<HTMLInputElement>);
      setSelectedOption(file);
    }
  }, [id, getSingleData, handleFileChange]);

  return (
    <Card>
      <Button
        onClick={() => {
          setTableData(getSingleData(id)?.data_target);
        }}
        className="lg:hidden text-cyan-400 bg-cyan-500/20 border border-cyan-500 hover:bg-cyan-700 hover:text-white"
      >
        <Sheet size={13} />
      </Button>
      <CardHeader>
        <CardTitle className="text-center tracking-wide">File</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full p-3" onClick={handleFileOpen}>
          {selectedOption ? (
            <div className="flex justify-between p-3 border rounded-xl m-2 bg-black">
              <p className="w-36 truncate">{selectedOption.name}</p>
              <X color="red" onClick={handleFileRemove} />
            </div>
          ) : (
            <p>Select a File</p>
          )}
          <Input
            type="file"
            ref={inputFile}
            className="hidden"
            accept=".csv,.json"
            onChange={handleFileChange}
          />
          <CardDescription>Allowed types: csv, json</CardDescription>
        </div>
      </CardContent>
      <CardFooter className="flex w-full flex-wrap">
        <Button
          onClick={handleRemoveBlock}
          className="w-full text-red-400 bg-red-500/20 border border-red-500 hover:bg-red-700 hover:text-white"
        >
          Delete
        </Button>
        <span className="text-xs mt-2">
          {ObjectStats(getSingleData(id)?.data_target)}
        </span>
      </CardFooter>
      <CustomHandle type="source" position={Position.Right} maxConnection={1} />
    </Card>
  );
}

export function InputExampleNode({ id }: { id: string }) {
  const { handleRemoveBlock } = useNodeData(id);
  const setTableData = useTableDataStore((state) => state.setTableData);
  const { getSingleData, setNodeData } = useNodeDataStore((state) => ({
    getSingleData: state.getSingleData,
    setNodeData: state.setNodeData,
  }));
  const [selectedOption, setSelectedOption] = useState<string | undefined>();

  const handleChange = useCallback(
    (option: string) => {
      if (option === "sample-json") {
        fetch("/data.json")
          .then((response) => response.json())
          .then((data) =>
            setNodeData({
              id,
              data_target: data,
              data_source: option,
              field: { exampleSelectedOption: option },
            })
          );
      }
      if (option === "sample-csv") {
        fetch("/data.csv")
          .then((response) => response.text())
          .then((data) => {
            Papa.parse(data, {
              header: true,
              complete: (result) => {
                setNodeData({
                  id,
                  data_target: result.data,
                  data_source: option,
                  field: { exampleSelectedOption: option },
                });
              },
            });
          });
      }
    },
    [id, setNodeData]
  );

  useEffect(() => {
    const initialSelectedOption =
      getSingleData(id)?.field?.exampleSelectedOption;
    setSelectedOption(initialSelectedOption);
    if (initialSelectedOption) {
      handleChange(initialSelectedOption);
    }
  }, [id, getSingleData, handleChange]);

  useEffect(() => {
    if (selectedOption) {
      handleChange(selectedOption);
    }
  }, [selectedOption, handleChange]);

  return (
    <>
      <Card>
        <Button
          onClick={() => {
            setTableData(getSingleData(id)?.data_target);
          }}
          className="lg:hidden text-cyan-400 bg-cyan-500/20 border border-cyan-500 hover:bg-cyan-700 hover:text-white"
        >
          <Sheet size={13} />
        </Button>
        <CardHeader>
          <CardTitle className="text-center tracking-wide">
            Example Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedOption}
            onValueChange={(cond) => {
              setSelectedOption(cond);
            }}
          >
            <SelectTrigger className="w-52 mb-3">
              <SelectValue placeholder="Sample Data" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sample-json">Sample JSON</SelectItem>
              <SelectItem value="sample-csv">Sample CSV</SelectItem>
            </SelectContent>
          </Select>
          <CardDescription>
            Data Source:
            {selectedOption === "sample-json" ? " Sample JSON" : null}
            {selectedOption === "sample-csv" ? " Sample CSV" : null}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex w-full flex-wrap">
          <Button
            onClick={handleRemoveBlock}
            className="w-full text-red-400 bg-red-500/20 border border-red-500 hover:bg-red-700 hover:text-white"
          >
            Delete
          </Button>
          {selectedOption && (
            <span className="text-xs mt-2">
              {ObjectStats(getSingleData(id)?.data_target)}
            </span>
          )}
        </CardFooter>
      </Card>
      <CustomHandle type="source" position={Position.Right} maxConnection={1} />
    </>
  );
}
