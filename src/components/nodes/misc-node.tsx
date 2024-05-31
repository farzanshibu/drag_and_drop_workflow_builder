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
import { useCallback, useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Position } from "reactflow";
import { toast } from "sonner";
import CustomHandle from "../global/custom-handle";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface statData {
  sum: number;
  mean: number;
  min: number;
  max: number;
  median: number;
  mode: number;
  variance: number;
  stdDev: number;
}

export function MiscMarkdownNode({ id }: { id: string }) {
  const { handleRemoveBlock } = useNodeData(id);
  const { getSingleData, setNodeData } = useNodeDataStore((state) => ({
    getSingleData: state.getSingleData,
    setNodeData: state.setNodeData,
  }));
  const markupData = getSingleData(id)?.data_source;
  const markupShow = getSingleData(id)?.field?.micsMarkupShow ?? true;

  return (
    <>
      {markupShow ? (
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
              value={typeof markupData === "string" ? markupData : ""}
              onChange={(e) => {
                setNodeData({
                  id,
                  data_source: e.target.value,
                  data_target: {},
                });
              }}
            />
          </CardContent>
          <CardFooter className="flex gap-3  w-full">
            <Button
              onClick={() =>
                setNodeData({
                  id,
                  data_target: {},
                  data_source: markupData,
                  field: { micsMarkupShow: !markupShow },
                })
              }
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
            onClick={() =>
              setNodeData({
                id,
                data_target: {},
                data_source: markupData,
                field: { micsMarkupShow: !markupShow },
              })
            }
            className=" text-slate-400 bg-slate-500/20 border border-slate-500 hover:bg-slate-700 hover:text-white opacity-0 hover:opacity-50 group group-hover:opacity-25 mb-3"
          >
            Show
          </Button>

          <Markdown>
            {typeof markupData === "string" ? markupData : ""}
          </Markdown>
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
      <CustomHandle type="target" position={Position.Left} maxConnection={1} />
    </>
  );
}

export function MiscStatNode({ data, id }: { data: Datatype; id: string }) {
  const edgeNodes = splitEdgeToNodes(data.edgesIDs, id);
  const sourceId = edgeNodes?.sourceId || "";
  const { lastNodeDataTarget, handleRemoveBlock } = useNodeData(id, sourceId);
  const { getSingleData, setNodeData } = useNodeDataStore((state) => ({
    getSingleData: state.getSingleData,
    setNodeData: state.setNodeData,
  }));

  const [selectedColumn, setSelectedColumn] = useState<string | undefined>();
  const [statData, setStatData] = useState<statData | undefined>();

  const handleStat = useCallback(
    (selectedColumn: string) => {
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

      const sum = columnData.reduce((a, b) => a + b, 0);
      const mean = sum / columnData.length;
      const min = Math.min(...columnData);
      const max = Math.max(...columnData);
      const sortedData = [...columnData].sort((a, b) => a - b);
      const median =
        sortedData.length % 2 === 0
          ? (sortedData[sortedData.length / 2 - 1] +
              sortedData[sortedData.length / 2]) /
            2
          : sortedData[(sortedData.length - 1) / 2];
      const mode = columnData.reduce((acc, val) => {
        acc[val] = acc[val] ? acc[val] + 1 : 1;
        return acc;
      }, {} as Record<number, number>);
      const modeValue = parseInt(
        Object.keys(mode).reduce((a, b) => (mode[a] > mode[b] ? a : b))
      );
      const modeCount = mode[modeValue];
      const variance =
        columnData.reduce((acc, val) => acc + (val - mean) ** 2, 0) /
        columnData.length;
      const stdDev = Math.sqrt(variance);

      const newStatData: statData = {
        sum,
        mean,
        min,
        max,
        median,
        mode: modeValue,
        variance,
        stdDev,
      };

      setNodeData({
        id,
        data_target: newStatData,
        data_source: lastNodeDataTarget,
        field: {
          miscSelectedColumn: selectedColumn,
        },
      });
      setStatData(newStatData);
      toast.success("Stat data generated successfully");
    },
    [lastNodeDataTarget, setNodeData, id]
  );
  useEffect(() => {
    const singleData = getSingleData(id)?.field;
    const initialStatData = getSingleData(id)?.data_target;
    const initialColumnName = singleData?.miscSelectedColumn;

    setSelectedColumn(initialColumnName);
    setStatData(initialStatData);

    if (selectedColumn) {
      handleStat(selectedColumn);
    }
  }, [id, getSingleData, selectedColumn, handleStat]);
  useEffect(() => {
    if (selectedColumn) {
      handleStat(selectedColumn);
    }
  }, [selectedColumn, handleStat]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-center tracking-wide">Stat Data</CardTitle>
        </CardHeader>
        {data.isConnected ? (
          <CardContent>
            <div className="text-center pb-2">Stat Data</div>
            <div className="flex flex-col gap-3 p-2 rounded-lg">
              <Select
                value={selectedColumn}
                onValueChange={(e) => {
                  setSelectedColumn(e);
                  handleStat(e);
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
      <CustomHandle type="target" position={Position.Left} maxConnection={1} />
    </>
  );
}

export default MiscStatNode;
