"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTableDataStore } from "@/store/table";
import { useEffect, useState } from "react";

export default function OutputContainer() {
  const tableData = useTableDataStore((state) => state.tableData);
  const [columnsName, setColumnsName] = useState<string[]>([]);

  useEffect(() => {
    if (tableData === undefined) return;
    if (tableData.length === 0) return;
    setColumnsName(Object.keys(tableData[0] || {}));
  }, [tableData]);

  if (tableData === undefined) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="w-full border-t border-b text-center p-1">Outputs</div>
      {tableData.length != 0 ? (
        <Table>
          <TableCaption>A list of your dataset.</TableCaption>
          <TableHeader>
            <TableRow className="bg-black/70">
              {columnsName.map((key) => (
                <TableHead key={key} className="capitalize">
                  {key}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.values(tableData).map((table: any, index: number) => (
              <TableRow key={index}>
                {Object.entries(table).map(([key, value]) => (
                  <TableCell key={key} className="font-medium">
                    {typeof value === "string" ? value : null}
                    {typeof value === "number" ? value : null}
                    {typeof value === null || typeof value === undefined
                      ? "null"
                      : null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          No data available ( Click on nodes to Get information )
        </div>
      )}
    </div>
  );
}
