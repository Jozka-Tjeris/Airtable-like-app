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
  const [data, setData] = useState<Row[]>(rows);

  const updateCell = (
    rowIndex: number,
    columnId: string,
    value: string
  ) => {
    setData(old =>
      old.map((row, i) =>
        i === rowIndex ? { ...row, [columnId]: value } : row
      )
    );
  };

  const tableColumns: ColumnDef<Row>[] = useMemo(() =>
    columnMeta.map(col => ({
      accessorKey: col.id,
      header: col.label,
      cell: info => (
        <TableCell
          value={String(info.getValue() ?? "")}
          onChange={newValue =>
            info.table.options.meta?.updateCell(
              info.row.index,
              info.column.id,
              newValue
            )
          }
        />
      ),
      enableResizing: true,
      size: 150,
      minSize: 80,
      maxSize: 300,
    })),
    [columnMeta] // only rebuild if columnMeta changes
  );

  const table = useReactTable({
    data: data,
    columns: tableColumns,
    columnResizeMode: 'onChange',
    enableColumnResizing: true,
    defaultColumn: { size: 150 },
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateCell,
    }
  });

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