import type { ColumnType } from "~/components/table/controller/tableTypes";

export type UpdateCellsMutation = {
  type: "updateCells";
  tableId: string;
  changes: {
    rowId: string;
    columnId: string;
    value: string | number;
  }[];
  userId: string;
};

export type AddRowMutation = {
  type: "addRow";
  tableId: string;
  optimisticId: string;
  order: number;
  userId: string;
};

export type AddColumnMutation = {
  type: "addColumn";
  tableId: string;
  optimisticId: string;
  order: number;
  name: string;
  columnType: ColumnType;
  userId: string;
};

export type DeleteRowMutation = {
  type: "deleteRow";
  tableId: string;
  rowId: string;
};

export type DeleteColumnMutation = {
  type: "deleteColumn";
  tableId: string;
  columnId: string;
};

export type RenameColumnMutation = {
  type: "renameColumn";
  tableId: string;
  columnId: string;
  newLabel: string;
};

export type TableMutation =
  | UpdateCellsMutation
  | AddRowMutation
  | AddColumnMutation
  | DeleteRowMutation
  | DeleteColumnMutation
  | RenameColumnMutation;

export type QueueItem = {
  id: string;
  mutation: TableMutation;
  createdAt: number;
  attempt: number;
};
