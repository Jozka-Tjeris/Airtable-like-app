import React, { useCallback } from "react";
import { flexRender } from "@tanstack/react-table";
import { useTableController, ROW_HEIGHT } from "@/components/table/controller/TableProvider";

/**
 * Notice: We've removed registerRef and activeCell from props
 * as they are now managed via the table instance or Context.
 */
export function TableBody() {
  const { table, rows, columns, handleDeleteRow } =
    useTableController();

  const hasRows = rows.length > 0;
  const hasColumns = columns.length > 0;

  const handleRowRightClick = useCallback(
    (e: React.MouseEvent, rowId: string, rowPosition: number) => {
      e.preventDefault();
      // Use e.stopPropagation to prevent triggering any cell selection logic
      e.stopPropagation();

      const confirmed = window.confirm(
        `Delete row "${rowPosition}"?\n\nThis will remove all its cell values.`,
      );

      if (confirmed) {
        handleDeleteRow(rowId);
      }
    },
    [handleDeleteRow],
  );

  // -----------------------------
  // Empty State logic
  // -----------------------------
  if (!hasRows && !hasColumns) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={Math.max(columns.length, 1)}
            className="italic px-4 text-center text-gray-500"
            style={{ height: ROW_HEIGHT, minHeight: ROW_HEIGHT }}
          >
            No rows to display
          </td>
        </tr>
      </tbody>
    );
  }

  if (hasRows && !hasColumns) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={1}
            className="text-center text-gray-500 italic align-middle"
            style={{ height: 2*ROW_HEIGHT }}
          >
            <div className="flex h-full items-center justify-center">
              {rows.length} row{rows.length > 1 ? "s" : ""} hidden.
              <br />
              Add a column to view data.
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  // -----------------------------
  // Render TanStack Row Model
  // -----------------------------
  return (
    <tbody>
      {table.getRowModel().rows.map((row, idx) => (
        <tr
          key={row.id}
          className={`border-b hover:bg-[#f0f0f0]`}
          onContextMenu={(e) => {
            const rowOriginal = row.original;
            e.preventDefault();
            e.stopPropagation();
            handleRowRightClick(e, rowOriginal.id, idx + 1);
          }}
        >
          {row.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              className="h-full border-r p-0 align-top"
              // Tailwind cannot generate dynamic classes, must use inline styles
              style={{ width: cell.column.getSize(), height: ROW_HEIGHT }}
            >
              {/* This is where the magic happens. flexRender calls the 
                  cell renderer defined in your TableProvider.
              */}
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
      <tr>
        {/* Filler cells for padding */}
        {columns.map((_, idx) => (
          <td key={idx} className="h-full border-r"
            style={{ height: ROW_HEIGHT }}
          />
        ))}
      </tr>
    </tbody>
  );
}
