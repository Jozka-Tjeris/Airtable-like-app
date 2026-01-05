import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface TableMeta<TData> {
    updateCell: (
      rowIndex: number,
      columnId: string,
      value: string
    ) => void;
  }
}
