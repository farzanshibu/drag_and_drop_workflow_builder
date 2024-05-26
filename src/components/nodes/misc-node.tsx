"use client";
import {
  Card,
  CardContent,
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
import { splitEdgeToNodes } from "@/lib/utils";
import { useNodeDataStore } from "@/store/node-data";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Position, useReactFlow } from "reactflow";
import { toast } from "sonner";
import CustomHandle from "../global/custom-handle";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export function MiscMarkdownNode({ id }: { id: string }) {
  const [show, setShow] = useState(false);
  const [data, setData] = useState<string>("**Hello world!!!**");
  const { setNodes } = useReactFlow();

  const handleRemoveBlock = () => {
    setNodes((nodes) => nodes.filter((n) => n.id !== id));
  };

  return (
    <>
      {show ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-center tracking-wide">
              Markdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Type your markdown here."
              className="w-80 h-56"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </CardContent>
          <CardFooter className="flex gap-3  w-full">
            <Button
              onClick={() => setShow(!show)}
              className="w-full text-sky-400 bg-sky-500/20 border border-sky-500 hover:bg-sky-700 hover:text-white"
            >
              Hide
            </Button>
            <Button
              onClick={handleRemoveBlock}
              className="w-full text-red-400 bg-red-500/20 border border-red-500 hover:bg-red-700 hover:text-white"
            >
              Delete
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="group">
          <Button
            onClick={() => setShow(!show)}
            className=" text-slate-400 bg-slate-500/20 border border-slate-500 hover:bg-slate-700 hover:text-white opacity-0 hover:opacity-50 group group-hover:opacity-25 mb-3"
          >
            Show
          </Button>

          <Markdown>{data}</Markdown>
        </div>
      )}
    </>
  );
}

export function MiscExportNode({ data, id }: { data: Datatype; id: string }) {
  const edgeNodes = splitEdgeToNodes(data.edgesIDs, id);
  const sourceId = edgeNodes?.sourceId || "";
  const { lastNodeDataTarget, handleRemoveBlock } = useNodeData(id, sourceId);
  const { getSingleData, setNodeData } = useNodeDataStore((state) => ({
    getSingleData: state.getSingleData,
    setNodeData: state.setNodeData,
  }));

  const handleDownloadData = (type: "csv" | "json") => {
    const data = [...lastNodeDataTarget];
    if (!data) return;
    if (type === "csv") {
      let csv = "";
      const headers = Object.keys(data[0]);
      csv += headers.join(",") + "\n";
      data.forEach((obj) => {
        const values = headers.map((header) => obj[header]);
        csv += values.join(",") + "\n";
      });
      const a = document.createElement("a");
      const file = new Blob([csv], {
        type: "text/csv",
      });
      a.href = URL.createObjectURL(file);
      a.download = `data.${type}`;
      a.click();
    } else if (type === "json") {
      const a = document.createElement("a");
      const file = new Blob([JSON.stringify(data)], {
        type: "application/json",
      });
      a.href = URL.createObjectURL(file);
      a.download = `data.${type}`;
      a.click();
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-center tracking-wide">
            Export Data
          </CardTitle>
        </CardHeader>
        {data.isConnected ? (
          <CardContent>
            <p className="text-center pb-2">Download Data</p>
            <div className="flex gap-3 border p-2 rounded-lg bg-black">
              <Button
                onClick={() => handleDownloadData("csv")}
                className="w-full text-lime-400 bg-lime-500/20 border border-lime-500 hover:bg-lime-700 hover:text-white"
              >
                as CSV
              </Button>
              <Button
                onClick={() => handleDownloadData("json")}
                className="w-full text-green-400 bg-green-500/20 border border-green-500 hover:bg-green-700 hover:text-white"
              >
                as JSON
              </Button>
            </div>
          </CardContent>
        ) : (
          <CardContent>
            <p className="text-center">No data to export</p>
          </CardContent>
        )}
        <CardFooter className="flex w-full">
          <Button
            onClick={handleRemoveBlock}
            className="w-full text-red-400 bg-red-500/20 border border-red-500 hover:bg-red-700 hover:text-white"
          >
            Delete
          </Button>
        </CardFooter>
      </Card>
      <CustomHandle type="target" position={Position.Left} />
    </>
  );
}

interface statData {
  sum: number;
  mean: number;
  min: number;
  max: number;
  median: number;
  mode: string;
  modeCount: any;
  variance: number;
  stdDev: number;
}

export function MiscStatNode({ data, id }: { data: Datatype; id: string }) {
  const edgeNodes = splitEdgeToNodes(data.edgesIDs, id);
  const sourceId = edgeNodes?.sourceId || "";
  const { lastNodeDataTarget, handleRemoveBlock } = useNodeData(id, sourceId);
  const { getSingleData, setNodeData } = useNodeDataStore((state) => ({
    getSingleData: state.getSingleData,
    setNodeData: state.setNodeData,
  }));
  const [selectedColumn, setSelectedColumn] = useState("");
  const [statData, setStatData] = useState<statData | undefined>();

  const handleStat = () => {
    if (!selectedColumn) {
      toast.error("Please select a column");
      return;
    }

    const data = [...lastNodeDataTarget];
    const columnData = data
      .map((d) => d[selectedColumn])
      .filter((val) => typeof val === "number");

    if (columnData.length === 0) {
      toast.error("Selected column does not contain numeric data");
      return;
    }

    const sum: number = columnData.reduce((a, b) => a + b, 0);
    const mean = sum / columnData.length;
    const min = Math.min(...columnData);
    const max = Math.max(...columnData);
    const sortedData = [...columnData].sort((a, b) => a - b);
    const median: number =
      sortedData.length % 2 === 0
        ? (sortedData[sortedData.length / 2 - 1] +
            sortedData[sortedData.length / 2]) /
          2
        : sortedData[(sortedData.length - 1) / 2];
    const mode = columnData.reduce((acc, val) => {
      acc[val] = acc[val] ? acc[val] + 1 : 1;
      return acc;
    }, {} as Record<number, number>);
    const modeValue = Object.keys(mode).reduce((a, b) =>
      mode[a] > mode[b] ? a : b
    );
    const modeCount = mode[modeValue];
    const variance =
      columnData.reduce((acc, val) => acc + (val - mean) ** 2, 0) /
      columnData.length;
    const stdDev = Math.sqrt(variance);
    setStatData({
      sum,
      mean,
      min,
      max,
      median,
      mode: modeValue,
      modeCount,
      variance,
      stdDev,
    });
    setNodeData({
      id,
      data_target: lastNodeDataTarget,
      data_source: lastNodeDataTarget,
    });
    toast.success("Stat data generated successfully");
  };
  useEffect(() => {
    if (selectedColumn && lastNodeDataTarget) {
      handleStat();
    }
  }, [selectedColumn, lastNodeDataTarget]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-center tracking-wide">Stat Data</CardTitle>
        </CardHeader>
        {data.isConnected ? (
          <CardContent>
            <div className="text-center pb-2">Download Data</div>
            <div className="flex flex-col gap-3 p-2 rounded-lg">
              <Select
                value={selectedColumn}
                onValueChange={(e) => {
                  setSelectedColumn(e);
                }}
              >
                <SelectTrigger className="w-96 mb-3">
                  <SelectValue placeholder="Select Column" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(lastNodeDataTarget[0] || {}).map(
                    (key, index) => (
                      <SelectItem key={index} value={key}>
                        {key}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              {statData ? (
                <div className="mt-4 w-full grid grid-cols-2 text-pretty">
                  <p>Sum: </p>
                  <span className="font-medium">{statData.sum.toFixed(2)}</span>
                  <p>Mean: </p>
                  <span className="font-medium">
                    {statData.mean.toFixed(2)}
                  </span>
                  <p>Min: </p>
                  <span className="font-medium">{statData.min.toFixed(2)}</span>
                  <p>Max: </p>
                  <span className="font-medium">{statData.max.toFixed(2)}</span>
                  <p>Median: </p>
                  <span className="font-medium">
                    {statData.median.toFixed(2)}
                  </span>
                  <p>Mode: </p>
                  <span className="font-medium">{statData.mode}</span>
                  <p>Count: </p>
                  <span className="font-medium">{statData.modeCount}</span>
                  <p>Variance: </p>
                  <span className="font-medium">
                    {statData.variance.toFixed(2)}
                  </span>
                  <p>Standard Deviation: </p>
                  <span className="font-medium">
                    {statData.stdDev.toFixed(2)}
                  </span>
                </div>
              ) : null}
            </div>
          </CardContent>
        ) : (
          <CardContent>
            <p className="text-center">No data to export</p>
          </CardContent>
        )}
        <CardFooter className="flex w-full">
          <Button
            onClick={handleRemoveBlock}
            className="w-full text-red-400 bg-red-500/20 border border-red-500 hover:bg-red-700 hover:text-white"
          >
            Delete
          </Button>
        </CardFooter>
      </Card>
      <CustomHandle type="target" position={Position.Left} />
    </>
  );
}
