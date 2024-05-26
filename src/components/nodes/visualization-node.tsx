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
import { splitEdgeToNodes } from "@/lib/utils";
import { useNodeDataStore } from "@/store/node-data";
import { useEffect, useState } from "react";
import { Position } from "reactflow";
import { toast } from "sonner";
import BarChart from "../charts/bar-chart";
import LineChart from "../charts/line-chart";
import ScatterChart from "../charts/scatter-chart";
import CustomHandle from "../global/custom-handle";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export function VisualizationBarchartNode({
  data,
  id,
}: {
  data: Datatype;
  id: string;
}) {
  const [columnName, setColumnName] = useState<string>();
  const [dataChart, setDataChart] = useState<any>();
  const edgeNodes = splitEdgeToNodes(data.edgesIDs, id);
  const sourceId = edgeNodes?.sourceId || "";
  const { lastNodeDataTarget, handleRemoveBlock } = useNodeData(id, sourceId);
  const { getSingleData, setNodeData } = useNodeDataStore((state) => ({
    getSingleData: state.getSingleData,
    setNodeData: state.setNodeData,
  }));

  useEffect(() => {
    if (columnName && lastNodeDataTarget) {
      handleGraphs();
    }
  }, [columnName, lastNodeDataTarget]);

  const handleGraphs = () => {
    if (!columnName) {
      toast.error("Invalid column name or sort condition");
      return;
    }
    if (!Array.isArray(lastNodeDataTarget)) {
      toast.error("Invalid data_target in source node");
      return;
    }

    const data = [...lastNodeDataTarget];

    // Calculate dynamic ranges
    const minCount = Math.min(...data.map((item) => item[columnName]));
    const maxCount = Math.max(...data.map((item) => item[columnName]));
    const numberOfRanges = 5; // Define how many ranges you want
    const rangeSize = Math.ceil((maxCount - minCount) / numberOfRanges);

    const ranges = Array.from({ length: numberOfRanges }, (_, i) => {
      const min = minCount + i * rangeSize;
      const max = min + rangeSize - 1;
      return { min, max, label: `${min}-${max}` };
    });

    // Group data into ranges
    const groupedData = ranges.map((range) => ({
      label: range.label,
      count: data
        .filter(
          (item) =>
            item[columnName] >= range.min && item[columnName] <= range.max
        )
        .reduce((sum, item) => sum + item[columnName], 0),
    }));

    const labels = groupedData.map((item) => item.label);
    const counts = groupedData.map((item) => item.count);

    setDataChart({
      labels,
      datasets: [
        {
          label: "Dataset Distribution",
          data: counts,
          backgroundColor: ["rgba(255, 99, 132, 0.8)"],
          borderColor: "rgb(255, 99, 132)",
        },
      ],
    });

    setNodeData({
      id,
      data_target: lastNodeDataTarget,
      data_source: lastNodeDataTarget,
    });
    toast.info(`Graphs updated with ${columnName}`);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-center tracking-wide">
            Line Chart
          </CardTitle>
        </CardHeader>
        {data.isConnected ? (
          <CardContent>
            <div className="flex flex-col gap-2">
              <Select
                value={columnName}
                onValueChange={(cond) => {
                  setColumnName(cond);
                }}
              >
                <SelectTrigger className="mb-3">
                  <SelectValue placeholder="Sample Data" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(lastNodeDataTarget[0] || {}).map((key) => (
                    <SelectItem key={key} value={key}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Separator />
              <p className="text-center pb-2">Chart Data</p>
              <div className="h-[500px] w-[900px]  bg-black">
                {dataChart ? <BarChart data={dataChart} /> : null}
              </div>
            </div>
          </CardContent>
        ) : (
          <p className="w-52 text-center pb-7 text-xs">No dataset connected</p>
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
export function VisualizationHistogramNode({
  data,
  id,
}: {
  data: Datatype;
  id: string;
}) {
  const [columnName, setColumnName] = useState<string>();
  const [dataChart, setDataChart] = useState<any>();
  const edgeNodes = splitEdgeToNodes(data.edgesIDs, id);
  const sourceId = edgeNodes?.sourceId || "";
  const { lastNodeDataTarget, handleRemoveBlock } = useNodeData(id, sourceId);
  const { getSingleData, setNodeData } = useNodeDataStore((state) => ({
    getSingleData: state.getSingleData,
    setNodeData: state.setNodeData,
  }));

  useEffect(() => {
    if (columnName && lastNodeDataTarget) {
      handleGraphs();
    }
  }, [columnName, lastNodeDataTarget]);

  const handleGraphs = () => {
    if (!columnName) {
      toast.error("Invalid column name or sort condition");
      return;
    }
    if (!Array.isArray(lastNodeDataTarget)) {
      toast.error("Invalid data_target in source node");
      return;
    }

    const data = [...lastNodeDataTarget];
    const countryCounts = new Map();
    data.forEach((item) => {
      const country = item[columnName] || "";
      countryCounts.set(country, (countryCounts.get(country) || 0) + 1);
    });

    const countArray = Array.from(countryCounts.entries()).map(
      ([country, count]) => ({ country, count })
    );

    const labels = countArray.map((item) => item["country"]);
    const counts = countArray.map((item) => item["count"]);

    setDataChart({
      labels,
      datasets: [
        {
          label: "Dataset Distribution",
          data: counts,
          backgroundColor: ["rgba(255, 99, 132, 0.8)"],
          borderColor: "rgb(255, 99, 132)",
        },
      ],
    });

    setNodeData({
      id,
      data_target: lastNodeDataTarget,
      data_source: lastNodeDataTarget,
    });
    toast.info(`Graphs updated with ${columnName}`);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-center tracking-wide">
            Line Chart
          </CardTitle>
        </CardHeader>
        {data.isConnected ? (
          <CardContent>
            <div className="flex flex-col gap-2">
              <Select
                value={columnName}
                onValueChange={(cond) => {
                  setColumnName(cond);
                }}
              >
                <SelectTrigger className="mb-3">
                  <SelectValue placeholder="Sample Data" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(lastNodeDataTarget[0] || {}).map((key) => (
                    <SelectItem key={key} value={key}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Separator />
              <p className="text-center pb-2">Chart Data</p>
              <div className="w-[500px]  bg-black">
                {dataChart ? <LineChart data={dataChart} /> : null}
              </div>
            </div>
          </CardContent>
        ) : (
          <p className="w-52 text-center pb-7 text-xs">No dataset connected</p>
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
export function VisualizationScatterplotNode({
  data,
  id,
}: {
  data: Datatype;
  id: string;
}) {
  const [columnName, setColumnName] = useState<string>();
  const [columnName2, setColumnName2] = useState<string>();
  const [dataChart, setDataChart] = useState<any>();
  const edgeNodes = splitEdgeToNodes(data.edgesIDs, id);
  const sourceId = edgeNodes?.sourceId || "";
  const { lastNodeDataTarget, handleRemoveBlock } = useNodeData(id, sourceId);
  const { getSingleData, setNodeData } = useNodeDataStore((state) => ({
    getSingleData: state.getSingleData,
    setNodeData: state.setNodeData,
  }));

  useEffect(() => {
    if (columnName && lastNodeDataTarget && columnName2) {
      handleGraphs();
    }
  }, [columnName, columnName2, lastNodeDataTarget]);

  const handleGraphs = () => {
    if (!columnName || !columnName2) {
      toast.error("Invalid column name or sort condition");
      return;
    }
    if (!Array.isArray(lastNodeDataTarget)) {
      toast.error("Invalid data_target in source node");
      return;
    }

    const data = [...lastNodeDataTarget];
    const scatterData = data.map((item) => ({
      x: item[columnName],
      y: item[columnName2],
    }));

    setDataChart({
      datasets: [
        {
          label: "Dataset Distribution",
          data: scatterData,
          backgroundColor: ["rgba(255, 99, 132, 0.8)"],
          borderColor: "rgb(255, 99, 132)",
        },
      ],
    });

    setNodeData({
      id,
      data_target: lastNodeDataTarget,
      data_source: lastNodeDataTarget,
    });
    toast.info(`Graphs updated with ${columnName}`);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-center tracking-wide">
            Scatter Chart
          </CardTitle>
        </CardHeader>
        {data.isConnected ? (
          <CardContent>
            <div className="flex flex-col gap-2">
              <CardDescription>X Axis</CardDescription>
              <Select
                value={columnName}
                onValueChange={(cond) => {
                  setColumnName(cond);
                }}
              >
                <SelectTrigger className="mb-3">
                  <SelectValue placeholder="Sample Data" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(lastNodeDataTarget[0] || {}).map((key) => (
                    <SelectItem key={key} value={key}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <CardDescription>Y Axis</CardDescription>
              <Select
                value={columnName2}
                onValueChange={(cond) => {
                  setColumnName2(cond);
                }}
              >
                <SelectTrigger className="mb-3">
                  <SelectValue placeholder="Sample Data" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(lastNodeDataTarget[0] || {}).map((key) => (
                    <SelectItem key={key} value={key}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Separator />
              <p className="text-center pb-2">Chart Data</p>
              <div className="w-[500px]  bg-black">
                {dataChart ? <ScatterChart data={dataChart} /> : null}
              </div>
            </div>
          </CardContent>
        ) : (
          <p className="w-52 text-center pb-7 text-xs">No dataset connected</p>
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
