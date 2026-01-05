"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
} from "@tanstack/react-table";
import { TableContext, type TableContextType } from "./TableContext";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";
import { TableCell } from "./TableCell";

import { columns as columnMeta, rows, type Row } from "./mockTableData";

export function BaseTable() {
  // -----------------------------
  // Dynamic state for rows & columns
  // -----------------------------
  const [data, setData] = useState<Row[]>(rows);
  const [columnsState, setColumnsState] = useState<typeof columnMeta>(columnMeta);

  // Function to update a single cell
  const updateCell = (rowIndex: number, columnId: string, value: string) => {
    setData(old =>
      old.map((row, i) => (i === rowIndex ? { ...row, [columnId]: value } : row))
    );
  };

  // Function to add a new column dynamically
  const addColumn = (id: keyof Row, label: string) => {
    setColumnsState(old => [...old, { id, label }]);
  };

  // Function to remove a column dynamically
  const removeColumn = (id: keyof Row) => {
    setColumnsState(old => old.filter(col => col.id !== id));
  };

  // -----------------------------
  // Columns for TanStack Table
  // -----------------------------
  const tableColumns: ColumnDef<Row>[] = useMemo(
    () =>
      columnsState.map(col => ({
        accessorKey: col.id,
        header: col.label,
        cell: info => (
          <TableCell
            value={
              typeof info.getValue() === "string" || typeof info.getValue() === "number"
                ? String(info.getValue())
                : ""
            }
            onChange={newValue =>
              info.table.options.meta?.updateCell(info.row.index, info.column.id, newValue)
            }
          />
        ),
        enableResizing: true,
        size: 150,
        minSize: 80,
        maxSize: 300,
      })),
    [columnsState] // recompute whenever columns change
  );

  // -----------------------------
  // Create the table instance
  // -----------------------------
  const table = useReactTable({
    data,
    columns: tableColumns,
    columnResizeMode: "onChange",
    enableColumnResizing: true,
    defaultColumn: { size: 150 },
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateCell, // used by TableCell onChange
    },
  });

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <TableContext.Provider value={{ table } as TableContextType<unknown>}>
      <div className="w-full overflow-x-auto border">
        <div className="max-h-[calc(100vh-136px)] overflow-y-auto">
          <table className="border-collapse table-auto w-max">
            <TableHeader />
            <TableBody />
          </table>
        </div>
      </div>
    </TableContext.Provider>
  );
}
