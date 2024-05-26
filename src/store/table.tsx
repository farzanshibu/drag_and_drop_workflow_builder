import { create } from "zustand";

type Storetype = {
  tableData: any[] | undefined;
  setTableData: (data: any[]) => void;
};

export const useTableDataStore = create<Storetype>()((set) => ({
  tableData: [],
  setTableData: (newData) =>
    set((state) => ({
      tableData: newData,
    })),
}));
