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
import { useTableDataStore } from "@/store/table";
import type { Datatype } from "@/types/types";
import { Sheet } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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
  const setTableData = useTableDataStore((state) => state.setTableData);

  const { getSingleData, setNodeData } = useNodeDataStore((state) => ({
    getSingleData: state.getSingleData,
    setNodeData: state.setNodeData,
  }));

  const [selectedColumn, setSelectedColumn] = useState<string>();
  const [newColumnName, setNewColumnName] = useState<string>();

  const renameData = useCallback(
    (selectedColumn: string | undefined, newColumnName: string | undefined) => {
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
        field: {
          ...getSingleData(id)?.field,
          transformSelectedOption: selectedColumn,
          transformColumnName: newColumnName,
        },
      });
      toast.info(`Renamed column ${selectedColumn} to ${newColumnName}`);
    },
    [lastNodeDataTarget, setNodeData, getSingleData, id]
  );
  useEffect(() => {
    const singleData = getSingleData(id)?.field;
    const initialColumnName = singleData?.transformColumnName;
    const initialSelectedOption = singleData?.transformSelectedOption;

    setNewColumnName(initialColumnName);
    setSelectedColumn(initialSelectedOption);

    if (initialColumnName && initialSelectedOption) {
      renameData(initialColumnName, initialSelectedOption);
    }
  }, [id, getSingleData, renameData]);

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
                onChange={(e) => {
                  setNewColumnName(e.target.value);
                }}
              />
            </div>
          </CardContent>
        ) : (
          <p className="w-52 text-center pb-7 text-xs">No dataset connected</p>
        )}
        <CardFooter className="flex gap-3 w-full flex-wrap">
          <Button
            onClick={() => renameData(selectedColumn, newColumnName)}
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
      <CustomHandle type="source" position={Position.Right} maxConnection={1} />
      <CustomHandle type="target" position={Position.Left} maxConnection={1} />
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
  const setTableData = useTableDataStore((state) => state.setTableData);
  const { lastNodeDataTarget, handleRemoveBlock } = useNodeData(id, sourceId);
  const { getSingleData, setNodeData } = useNodeDataStore((state) => ({
    getSingleData: state.getSingleData,
    setNodeData: state.setNodeData,
  }));

  const [selectedColumn, setSelectedColumn] = useState<string>();
  const [selectedCondition, setSelectedCondition] = useState<string>();
  const [conditionData, setConditionData] = useState<string>();

  const filterData = useCallback(
    (
      selectedColumn: string | undefined,
      selectedCondition: string | undefined,
      conditionData: string | undefined
    ) => {
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
        field: {
          ...getSingleData(id)?.field,
          transformSelectedOption: conditionData,
          transformSelectedCondition: selectedCondition,
          transformColumnName: selectedColumn,
        },
      });
      toast.info(
        `Filtered data by ${selectedColumn} with ${selectedCondition}`
      );
    },
    [lastNodeDataTarget, setNodeData, getSingleData, id]
  );

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

  useEffect(() => {
    const singleData = getSingleData(id)?.field;
    const initialSelectedOption = singleData?.transformSelectedOption;
    const initialSelectedCondition = singleData?.transformSelectedCondition;
    const initialColumnName = singleData?.transformColumnName;

    setSelectedColumn(initialColumnName);
    setSelectedCondition(initialSelectedCondition);
    setConditionData(initialSelectedOption);

    if (
      initialSelectedOption &&
      initialSelectedCondition &&
      initialColumnName
    ) {
      filterData(
        initialSelectedOption,
        initialSelectedCondition,
        initialColumnName
      );
    }
  }, [id, getSingleData, filterData]);

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
          <CardTitle className="text-center tracking-wide">Filter</CardTitle>
        </CardHeader>
        <CardContent>
          {data.isConnected ? (
            <div className="flex gap-2 flex-col">
              <CardDescription>Column name: </CardDescription>
              <Select
                value={selectedColumn}
                onValueChange={(e) => {
                  setSelectedColumn(e);
                }}
              >
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
                onValueChange={(e) => {
                  setSelectedCondition(e);
                }}
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
                onChange={(e) => {
                  setConditionData(e.target.value);
                }}
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
            onClick={() =>
              filterData(selectedColumn, selectedCondition, conditionData)
            }
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
      <CustomHandle type="source" position={Position.Right} maxConnection={1} />
      <CustomHandle type="target" position={Position.Left} maxConnection={1} />
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
  const setTableData = useTableDataStore((state) => state.setTableData);
  const { getSingleData, setNodeData } = useNodeDataStore((state) => ({
    getSingleData: state.getSingleData,
    setNodeData: state.setNodeData,
  }));

  const [groupIndex, setGroupIndex] = useState<string>();

  const groupData = useCallback(
    (groupIndex: string) => {
      if (!groupIndex) {
        toast.error("Invalid column name");
        return;
      }

      if (!Array.isArray(lastNodeDataTarget)) {
        toast.error("Invalid data_target in source node");
        return;
      }

      const dataToGroup = [...lastNodeDataTarget];
      const groupedData = dataToGroup.reduce((acc, curr) => {
        const groupKey = curr[groupIndex]; // Use val instead of groupIndex
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
        field: {
          ...getSingleData(id)?.field,
          transformSelectedGroup: groupIndex,
        },
      });
      toast.info(`Grouped data by ${groupIndex}`);
    },
    [lastNodeDataTarget, setNodeData, getSingleData, id]
  );
  useEffect(() => {
    const singleData = getSingleData(id)?.field;
    const initialGroupName = singleData?.transformSelectedGroup;

    setGroupIndex(initialGroupName);

    if (initialGroupName) {
      groupData(initialGroupName);
    }
  }, [id, getSingleData, groupData]);
  useEffect(() => {
    if (groupIndex) {
      groupData(groupIndex);
    }
  }, [groupIndex, groupData]);

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
          <CardTitle className="text-center tracking-wide">Group</CardTitle>
        </CardHeader>
        {data.isConnected ? (
          <CardContent>
            <div className="flex gap-2 flex-col">
              <CardDescription>Column name: </CardDescription>
              <Select
                value={groupIndex}
                onValueChange={(val) => {
                  setGroupIndex(val);
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
      <CustomHandle type="source" position={Position.Right} maxConnection={1} />
      <CustomHandle type="target" position={Position.Left} maxConnection={1} />
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
  const setTableData = useTableDataStore((state) => state.setTableData);
  const { getSingleData, setNodeData } = useNodeDataStore((state) => ({
    getSingleData: state.getSingleData,
    setNodeData: state.setNodeData,
  }));

  const [datasetOneColumn, setDatasetOneColumn] = useState<string>();
  const [datasetTwoColumn, setDatasetTwoColumn] = useState<string>();

  const mergeData = useCallback(
    (datasetOneColumn: string, datasetTwoColumn: string) => {
      if (!datasetOneColumn || !datasetTwoColumn) {
        toast.error("Invalid column name");
        return;
      }
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
      setNodeData({
        id,
        data_target: mergedData,
        data_source: lastNodeDataTarget,
        field: {
          ...getSingleData(id)?.field,
          transformColumnName: datasetOneColumn,
          transformColumnName2: datasetTwoColumn,
        },
      });
      toast.info(`Merged data together`);
    },
    [lastNodeDataTarget, lastNodeDataTargetB, setNodeData, getSingleData, id]
  );

  useEffect(() => {
    const singleData = getSingleData(id)?.field;
    const initialColumnName = singleData?.transformColumnName;
    const initialColumnName2 = singleData?.transformColumnName2;

    setDatasetOneColumn(initialColumnName);
    setDatasetTwoColumn(initialColumnName2);

    if (initialColumnName && initialColumnName2) {
      mergeData(initialColumnName, initialColumnName2);
    }
  }, [id, getSingleData, mergeData]);
  useEffect(() => {
    if (datasetOneColumn && datasetTwoColumn) {
      mergeData(datasetOneColumn, datasetTwoColumn);
    }
  }, [datasetOneColumn, datasetTwoColumn, mergeData]);

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
        maxConnection={1}
        customStyle={{ top: 60 }}
      />
      <CustomHandle
        type="target"
        position={Position.Left}
        id="DatasetTwo"
        maxConnection={1}
        customStyle={{ top: 120 }}
      />
      <CustomHandle type="source" position={Position.Right} maxConnection={1} />
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
  const setTableData = useTableDataStore((state) => state.setTableData);
  const { getSingleData, setNodeData } = useNodeDataStore((state) => ({
    getSingleData: state.getSingleData,
    setNodeData: state.setNodeData,
  }));

  const [start, setStart] = useState<number | undefined>();
  const [end, setEnd] = useState<number | undefined>();

  const sliceData = useCallback(
    (start: number, end: number) => {
      if (!start || !end) {
        toast.error("Invalid start or end index");
        return;
      }

      if (start > end) {
        toast.error("Start index should be less than end index");
        return;
      }
      if (start < 0 || end < 0) {
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
        field: {
          ...getSingleData(id)?.field,
          transformIndexStart: start,
          transformIndexEnd: end,
        },
      });
      toast.info(`Sliced data from index ${start} to ${end}`);
    },
    [lastNodeDataTarget, setNodeData, getSingleData, id]
  );

  useEffect(() => {
    const singleData = getSingleData(id)?.field;
    const initialIndexStart = singleData?.transformIndexStart;
    const initialIndexEnd = singleData?.transformIndexEnd;

    setStart(initialIndexStart);
    setEnd(initialIndexEnd);

    if (initialIndexStart && initialIndexEnd) {
      sliceData(initialIndexStart, initialIndexEnd);
    }
  }, [id, getSingleData, sliceData]);
  useEffect(() => {
    if (start && end) {
      sliceData(start, end);
    }
  }, [start, end, sliceData]);

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
          <CardTitle className="text-center tracking-wide">Slice</CardTitle>
        </CardHeader>
        {data.isConnected ? (
          <CardContent>
            <div className="flex gap-2 flex-col">
              <CardDescription>Form index: </CardDescription>
              <Input
                placeholder="0"
                type="number"
                value={getSingleData(id)?.field?.transformIndexStart}
                onChange={(evt) =>
                  setStart(parseInt(evt.target.value) || undefined)
                }
              />
              <CardDescription>To index: </CardDescription>
              <Input
                placeholder="5"
                type="number"
                value={getSingleData(id)?.field?.transformIndexEnd}
                onChange={(evt) =>
                  setEnd(parseInt(evt.target.value) || undefined)
                }
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
      <CustomHandle type="source" position={Position.Right} maxConnection={1} />
      <CustomHandle type="target" position={Position.Left} maxConnection={1} />
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
  const setTableData = useTableDataStore((state) => state.setTableData);
  const { getSingleData, setNodeData } = useNodeDataStore((state) => ({
    getSingleData: state.getSingleData,
    setNodeData: state.setNodeData,
  }));

  const [columnName, setColumnName] = useState<string | undefined>();
  const [sortConditions, setSortConditions] = useState<string | undefined>();

  const sortData = useCallback(
    (column: string, order: string) => {
      if (!Array.isArray(lastNodeDataTarget)) {
        toast.error("Invalid data_target in source node");
        return;
      }

      const dataToSort = [...lastNodeDataTarget];

      const sortedData = dataToSort.sort((a, b) => {
        const valA = a[column];
        const valB = b[column];

        if (typeof valA === "number" && typeof valB === "number") {
          return order === "ascending" ? valA - valB : valB - valA;
        } else if (typeof valA === "string" && typeof valB === "string") {
          return order === "ascending"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        } else {
          return 0;
        }
      });

      setNodeData({
        id,
        data_target: sortedData,
        data_source: lastNodeDataTarget,
        field: {
          ...getSingleData(id)?.field,
          transformColumnName: column,
          transformSortConditions: order,
        },
      });

      toast.info(`Sorted data by ${column} in ${order} order`);
    },
    [lastNodeDataTarget, setNodeData, getSingleData, id]
  );
  useEffect(() => {
    const singleData = getSingleData(id)?.field;
    const initialColumnName = singleData?.transformColumnName;
    const initialSortConditions = singleData?.transformSortConditions;

    setColumnName(initialColumnName);
    setSortConditions(initialSortConditions);

    if (initialColumnName && initialSortConditions) {
      sortData(initialColumnName, initialSortConditions);
    }
  }, [id, getSingleData, sortData]);
  useEffect(() => {
    if (columnName && sortConditions) {
      sortData(columnName, sortConditions);
    }
  }, [columnName, sortConditions, sortData]);

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
                }}
              >
                <SelectTrigger className="w-52 mb-3">
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
              <CardDescription>Order by: </CardDescription>
              <Select
                value={sortConditions}
                onValueChange={(cond) => {
                  setSortConditions(cond);
                }}
              >
                <SelectTrigger className="w-52 mb-3">
                  <SelectValue placeholder="Select Order" />
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
      <CustomHandle type="source" position={Position.Right} maxConnection={1} />
      <CustomHandle type="target" position={Position.Left} maxConnection={1} />
    </>
  );
}
