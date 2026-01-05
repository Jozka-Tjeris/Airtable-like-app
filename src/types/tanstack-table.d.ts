import "@tanstack/react-table";
import type { Row } from "~/components/table/mockTableData";

declare module "@tanstack/react-table" {
  interface TableMeta {
    updateCell: (
      rowIndex: number,
      columnId: string,
      value: string
    ) => void;
    addColumn: (
      id: keyof Row, 
      label: string
    ) => void;
    removeColumn: (
      id: keyof Row
    ) => void;
  }
}
