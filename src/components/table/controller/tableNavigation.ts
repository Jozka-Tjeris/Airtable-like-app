import { useTableController } from "./TableProvider";
import { useCallback } from "react";

export function useMoveActiveCell() {
  const { activeCell, rows, columns, setActiveCell } = useTableController();

  return useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (!activeCell) return;

      const rowIndex = rows.findIndex(r => r.id === activeCell.rowId);
      const colIndex = columns.findIndex(c => c.id === activeCell.columnId);

      let nextRow = rowIndex;
      let nextCol = colIndex;

      switch (direction) {
        case "up": nextRow = Math.max(0, rowIndex - 1); break;
        case "down": nextRow = Math.min(rows.length - 1, rowIndex + 1); break;
        case "left": nextCol = Math.max(0, colIndex - 1); break;
        case "right": nextCol = Math.min(columns.length - 1, colIndex + 1); break;
      }

      if (nextRow === rowIndex && nextCol === colIndex) return;

      setActiveCell({ rowId: rows[nextRow]!.id, columnId: columns[nextCol]!.id });
    },
    [activeCell, rows, columns, setActiveCell]
  );
}
