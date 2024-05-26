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
import { ObjectStats, splitEdgeToNodes } from "@/lib/utils";
import { useNodeDataStore } from "@/store/node-data";
import { useState } from "react";
import { Position } from "reactflow";
import { toast } from "sonner";
import CustomHandle from "../global/custom-handle";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function TransformRenameNode({
  data,
  id,
}: {
  data: Datatype;
  id: string;
}) {
  const edgeNodes = splitEdgeToNodes(data.edgesIDs, id);
  const sourceId = edgeNodes?.sourceId || "";
  const { lastNodeDataTarget, handleRemoveBlock } = useNodeData(id, sourceId);
  const { getSingleData, setNodeData } = useNodeDataStore((state) => ({
    getSingleData: state.getSingleData,
    setNodeData: state.setNodeData,
  }));
  const [selectedColumn, setSelectedColumn] = useState("");
  const [newColumnName, setNewColumnName] = useState("");

  const handleRename = () => {
    if (!selectedColumn || !newColumnName) {
      toast.error("Invalid column name or new column name");
      return;
    }

    if (!Array.isArray(lastNodeDataTarget)) {
      toast.error("Invalid data_target in source node");
      return;
    }

    const dataToRename = [...lastNodeDataTarget];
    const updatedData = dataToRename.map((row) => {
      if (selectedColumn in row) {
        // Create a new object with the updated properties
        return {
          ...row,
          [newColumnName]: row[selectedColumn],
          [selectedColumn]: undefined,
        };
      }
      return row;
    });
    // Delete the old column after updating the Zustand store
    const finalData = updatedData.map((row) => {
      const { [selectedColumn]: _, ...rest } = row;
      return rest;
    });

    setNodeData({
      id,
      data_target: finalData,
      data_source: lastNodeDataTarget,
    });
    toast.info(`Renamed column ${selectedColumn} to ${newColumnName}`);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-center tracking-wide">
            Rename Columns
          </CardTitle>
        </CardHeader>
        {data.isConnected ? (
          <CardContent>
            <div className="flex gap-2">
              <Select
                value={selectedColumn}
                onValueChange={(e) => {
                  setSelectedColumn(e);
                }}
              >
                <SelectTrigger className="w-52 mb-3">
                  <SelectValue placeholder="Sample Data" />
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
              <Input
                placeholder="New Column Name"
                className="w-52"
                onChange={(e) => setNewColumnName(e.target.value)}
              />
            </div>
          </CardContent>
        ) : (
          <p className="w-52 text-center pb-7 text-xs">No dataset connected</p>
        )}
        <CardFooter className="flex gap-3 w-full flex-wrap">
          <Button
            onClick={handleRename}
            className="flex-1 text-sky-400 bg-sky-500/20 border border-sky-500 hover:bg-sky-700 hover:text-white"
          >
            Run
          </Button>
          <Button
            onClick={handleRemoveBlock}
            className="flex-1 text-red-400 bg-red-500/20 border border-red-500 hover:bg-red-700 hover:text-white"
          >
            Delete
          </Button>

          <span className="text-xs mt-2 w-full">
            {ObjectStats(getSingleData(id)?.data_target)}
          </span>
        </CardFooter>
      </Card>
      <CustomHandle type="source" position={Position.Right} />
      <CustomHandle type="target" position={Position.Left} />
    </>
  );
}
export function TransformFilterNode({
  data,
  id,
}: {
  data: Datatype;
  id: string;
}) {
  const edgeNodes = splitEdgeToNodes(data.edgesIDs, id);
  const sourceId = edgeNodes?.sourceId || "";
  const { lastNodeDataTarget, handleRemoveBlock } = useNodeData(id, sourceId);
  const { getSingleData, setNodeData } = useNodeDataStore((state) => ({
    getSingleData: state.getSingleData,
    setNodeData: state.setNodeData,
  }));

  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [conditionData, setConditionData] = useState("");

  const handleFilter = () => {
    if (!selectedColumn || !selectedCondition || !conditionData) {
      toast.error("Invalid column name, condition or value");
      return;
    }
    if (!Array.isArray(lastNodeDataTarget)) {
      toast.error("Invalid data_target in source node");
      return;
    }
    const dataToFilter = [...lastNodeDataTarget];

    const filteredData = applyFilter(
      dataToFilter,
      selectedColumn,
      selectedCondition,
      conditionData
    );
    setNodeData({
      id,
      data_target: filteredData,
      data_source: lastNodeDataTarget,
    });
    toast.info(`Filtered data by ${selectedColumn} with ${selectedCondition}`);
  };

  const applyFilter = (
    data: any[],
    column: string,
    condition: string,
    value: string
  ) => {
    return data.filter((item) => {
      if (condition === "equals") {
        return item[column] === value;
      }
      if (condition === "dont_equals") {
        return item[column] !== value;
      }
      if (condition === "contains") {
        return item[column].includes(value);
      }
      if (condition === "dont_contains") {
        return !item[column].includes(value);
      }
      if (condition === "data_without_empty_null") {
        return item[column] !== "" && item[column] !== null;
      }
      return false;
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-center tracking-wide">Filter</CardTitle>
        </CardHeader>
        <CardContent>
          {data.isConnected ? (
            <div className="flex gap-2 flex-col">
              <CardDescription>Column name: </CardDescription>
              <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                <SelectTrigger className="w-full mb-3">
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
              <CardDescription>Conditions: </CardDescription>
              <Select
                value={selectedCondition}
                onValueChange={setSelectedCondition}
              >
                <SelectTrigger className="w-full mb-3">
                  <SelectValue placeholder="Select Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Text Equals</SelectItem>
                  <SelectItem value="dont_equals">Text Dont Equals</SelectItem>
                  <SelectItem value="contains">Text Contains</SelectItem>
                  <SelectItem value="dont_contains">
                    Test Dont Contains
                  </SelectItem>
                  <SelectItem value="data_without_empty_null">
                    Data without Empty and Null
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Value"
                className="w-full"
                value={conditionData}
                onChange={(e) => setConditionData(e.target.value)}
              />
            </div>
          ) : (
            <p className="w-52 text-center pb-7 text-xs">
              No dataset connected
            </p>
          )}
        </CardContent>
        <CardFooter className="flex gap-3 w-full flex-wrap">
          <Button
            onClick={handleFilter}
            className="flex-1 text-sky-400 bg-sky-500/20 border border-sky-500 hover:bg-sky-700 hover:text-white"
          >
            Run
          </Button>
          <Button
            onClick={handleRemoveBlock}
            className="flex-1 text-red-400 bg-red-500/20 border border-red-500 hover:bg-red-700 hover:text-white"
          >
            Delete
          </Button>

          <span className="text-xs mt-2 w-full">
            {ObjectStats(getSingleData(id)?.data_target)}
          </span>
        </CardFooter>
      </Card>
      <CustomHandle type="source" position={Position.Right} />
      <CustomHandle type="target" position={Position.Left} />
    </>
  );
}
export function TransformGroupNode({
  data,
  id,
}: {
  data: Datatype;
  id: string;
}) {
  const edgeNodes = splitEdgeToNodes(data.edgesIDs, id);
  const sourceId = edgeNodes?.sourceId || "";
  const { lastNodeDataTarget, handleRemoveBlock } = useNodeData(id, sourceId);
  const { getSingleData, setNodeData } = useNodeDataStore((state) => ({
    getSingleData: state.getSingleData,
    setNodeData: state.setNodeData,
  }));
  const [groupIndex, setGroupIndex] = useState("");

  const handleGroup = (val: string) => {
    setGroupIndex(val);
    if (!val) {
      toast.error("Invalid column name");
      return;
    }

    if (!Array.isArray(lastNodeDataTarget)) {
      toast.error("Invalid data_target in source node");
      return;
    }

    const dataToGroup = [...lastNodeDataTarget];
    const groupedData = dataToGroup.reduce((acc, curr) => {
      const groupKey = curr[val]; // Use val instead of groupIndex
      const existingGroup = acc.find(
        (group: any) =>
          group.groupKey !== undefined && group.groupKey === groupKey
      );

      if (existingGroup) {
        existingGroup.groupData.push(curr);
      } else {
        acc.push({ groupKey, groupData: [curr] });
      }

      return acc;
    }, []);

    setNodeData({
      id,
      data_target: groupedData,
      data_source: lastNodeDataTarget,
    });
    toast.info(`Grouped data by ${val}`);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-center tracking-wide">Group</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-col">
            <CardDescription>Column name: </CardDescription>
            <Select
              value={groupIndex}
              onValueChange={(val) => handleGroup(val)}
            >
              <SelectTrigger className="w-52 mb-3">
                <SelectValue placeholder="Sample Data" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(lastNodeDataTarget[0] || {}).map((key, index) => (
                  <SelectItem key={index} value={key}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
      </Card>
      <CustomHandle type="source" position={Position.Right} />
      <CustomHandle type="target" position={Position.Left} />
    </>
  );
}
export function TransformMergeNode({
  data,
  id,
}: {
  data: Datatype;
  id: string;
}) {
  const edgeNodes = splitEdgeToNodes(data.edgesIDs, id);
  const sourceId = edgeNodes?.sourceId || "";
  const sourceIdB = edgeNodes?.sourceIdB || "";
  const { lastNodeDataTarget, lastNodeDataTargetB, handleRemoveBlock } =
    useNodeData(id, sourceId, sourceIdB);

  const { getSingleData, setNodeData } = useNodeDataStore((state) => ({
    getSingleData: state.getSingleData,
    setNodeData: state.setNodeData,
  }));

  const [datasetOneColumn, setDatasetOneColumn] = useState("");
  const [datasetTwoColumn, setDatasetTwoColumn] = useState("");

  const handleMerge = () => {
    if (!Array.isArray(lastNodeDataTarget)) {
      toast.error("Invalid Dataset1 in source node");
      return;
    }
    if (!Array.isArray(lastNodeDataTargetB)) {
      toast.error("Invalid Dataset2 in source node");
      return;
    }
    const dataToMerage1 = [...lastNodeDataTarget];
    const dataToMerage2 = [...lastNodeDataTargetB];
    let mergedData = [];
    if (datasetOneColumn && datasetTwoColumn) {
      mergedData = dataToMerage1.map((item, index) => {
        return {
          ...item,
          ...dataToMerage2[index],
        };
      });
    }
    console.log(mergedData);
    setNodeData({
      id,
      data_target: mergedData,
      data_source: lastNodeDataTarget,
    });
    toast.info(`Merged data together`);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-center tracking-wide">Merge</CardTitle>
        </CardHeader>
        {data.isConnected ? (
          <CardContent>
            <div className="flex gap-2 flex-col">
              <CardDescription>Dataset 1: </CardDescription>
              <Select
                value={datasetOneColumn}
                onValueChange={(val) => {
                  setDatasetOneColumn(val);
                  handleMerge();
                }}
              >
                <SelectTrigger className="w-52 mb-3">
                  <SelectValue placeholder="Sample Data" />
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
              <CardDescription>Dataset 2: </CardDescription>
              <Select
                value={datasetTwoColumn}
                onValueChange={(val) => {
                  setDatasetTwoColumn(val);
                  handleMerge();
                }}
              >
                <SelectTrigger className="w-52 mb-3">
                  <SelectValue placeholder="Sample Data" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(lastNodeDataTargetB[0] || {}).map(
                    (key, index) => (
                      <SelectItem key={index} value={key}>
                        {key}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        ) : (
          <p className="w-52 text-center pb-7 text-xs">No dataset connected</p>
        )}
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
      </Card>
      <CustomHandle
        type="target"
        position={Position.Left}
        id="DatasetOne"
        customStyle={{ top: 60 }}
      />
      <CustomHandle
        type="target"
        position={Position.Left}
        id="DatasetTwo"
        customStyle={{ top: 120 }}
      />
      <CustomHandle type="source" position={Position.Right} />
    </>
  );
}
export function TransformSliceNode({
  data,
  id,
}: {
  data: Datatype;
  id: string;
}) {
  const edgeNodes = splitEdgeToNodes(data.edgesIDs, id);
  const sourceId = edgeNodes?.sourceId || "";
  const { lastNodeDataTarget, handleRemoveBlock } = useNodeData(id, sourceId);
  const { getSingleData, setNodeData } = useNodeDataStore((state) => ({
    getSingleData: state.getSingleData,
    setNodeData: state.setNodeData,
  }));

  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>();

  const handleSlice = () => {
    if (start === undefined || end === undefined) {
      toast.error("Invalid start or end index");
      return;
    }

    if (start < end) {
      toast.error("Start index should be less than end index");
      return;
    }
    if (start > 0 || end > 0) {
      toast.error("Start and end index should be positive");
      return;
    }
    if (!Array.isArray(lastNodeDataTarget)) {
      toast.error("Invalid data_target in source node");
      return;
    }

    const dataToSlice = [...lastNodeDataTarget];

    const slicedData = dataToSlice.slice(start, end);
    setNodeData({
      id,
      data_target: slicedData,
      data_source: lastNodeDataTarget,
    });
    toast.info(`Sliced data from index ${start} to ${end}`);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-center tracking-wide">Slice</CardTitle>
        </CardHeader>
        {data.isConnected ? (
          <CardContent>
            <div className="flex gap-2 flex-col">
              <CardDescription>Form index: </CardDescription>
              <Input
                placeholder="0"
                type="number"
                value={start}
                onChange={(evt) => setStart(parseInt(evt.target.value))}
              />
              <CardDescription>To index: </CardDescription>
              <Input
                placeholder="5"
                type="number"
                value={end}
                onBlur={handleSlice}
                onChange={(evt) => {
                  setEnd(parseInt(evt.target.value));
                }}
              />
            </div>
          </CardContent>
        ) : (
          <p className="w-52 text-center pb-7 text-xs">No dataset connected</p>
        )}
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
      </Card>
      <CustomHandle type="source" position={Position.Right} />
      <CustomHandle type="target" position={Position.Left} />
    </>
  );
}
export function TransformSortNode({
  data,
  id,
}: {
  data: Datatype;
  id: string;
}) {
  const edgeNodes = splitEdgeToNodes(data.edgesIDs, id);
  const sourceId = edgeNodes?.sourceId || "";
  const { lastNodeDataTarget, handleRemoveBlock } = useNodeData(id, sourceId);
  const { getSingleData, setNodeData } = useNodeDataStore((state) => ({
    getSingleData: state.getSingleData,
    setNodeData: state.setNodeData,
  }));

  const [columnName, setColumnName] = useState("");
  const [sortConditions, setSortConditions] = useState("");

  const handleSort = () => {
    if (!columnName) {
      toast.error("Invalid column name or sort condition");
      return;
    }

    if (!Array.isArray(lastNodeDataTarget)) {
      toast.error("Invalid data_target in source node");
      return;
    }
    const dataToSort = [...lastNodeDataTarget];

    const sortedData = dataToSort.sort((a, b) => {
      const valA = a[columnName];
      const valB = b[columnName];

      if (typeof valA === "number" && typeof valB === "number") {
        return sortConditions === "descending" ? valA - valB : valB - valA;
      } else if (typeof valA === "string" && typeof valB === "string") {
        return sortConditions === "descending"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        return 0;
      }
    });

    // Update data with sorted array
    setNodeData({
      id,
      data_target: sortedData,
      data_source: lastNodeDataTarget,
    });
    toast.info(`Sorted data by ${columnName} in ${sortConditions} order`);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-center tracking-wide">Sort</CardTitle>
        </CardHeader>
        {data.isConnected ? (
          <CardContent>
            <div className="flex gap-2 flex-col">
              <CardDescription>Column name: </CardDescription>
              <Select
                value={columnName}
                onValueChange={(cond) => {
                  setColumnName(cond);
                  handleSort();
                }}
              >
                <SelectTrigger className="w-52 mb-3">
                  <SelectValue placeholder="Sample Data" />
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
              <CardDescription>Order by: </CardDescription>
              <Select
                value={sortConditions}
                onValueChange={(cond) => {
                  setSortConditions(cond);
                  handleSort();
                }}
              >
                <SelectTrigger className="w-52 mb-3">
                  <SelectValue placeholder="Sample Data" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ascending">Ascending</SelectItem>
                  <SelectItem value="descending">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        ) : (
          <p className="w-52 text-center pb-7 text-xs">No dataset connected</p>
        )}
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
      </Card>
      <CustomHandle type="source" position={Position.Right} />
      <CustomHandle type="target" position={Position.Left} />
    </>
  );
}
