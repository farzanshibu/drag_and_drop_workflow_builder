import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Storetype = {
  tableData: any[] | undefined;
  setTableData: (data: any[]) => void;
};

export const useTableDataStore = create<Storetype>()(
  immer((set) => ({
    tableData: [],
    setTableData: (newData) =>
      set((state) => ({
        tableData: newData,
      })),
  }))
);
