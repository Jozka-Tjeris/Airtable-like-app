import { useTableStructureController } from "./TableProvider";
import { useCallback, useEffect, useMemo } from "react";

export function useMoveActiveCell() {
  const { activeCell, setActiveCell, table, rowVirtualizer } = useTableStructureController();

  const leftLeafCols = table.getLeftLeafColumns().map(c => c.id);
  const centerLeafCols = table.getCenterLeafColumns().map(c => c.id);
  const rightLeafCols = table.getRightLeafColumns().map(c => c.id);
  const columnVisibility = table.getState().columnVisibility;

  // Build the full visual column order including pinned and visible columns
  const visualColumnOrder = useMemo(() => {
    // Combine into full order
    return [...leftLeafCols, ...centerLeafCols, ...rightLeafCols].filter(
      colId => columnVisibility[colId] ?? true
    );
  }, 
  [leftLeafCols, centerLeafCols, rightLeafCols, columnVisibility]);

  const rowModel = table.getRowModel();
  // Only include rows currently visible after filtering/sorting/searching
  const visibleRows = useMemo(() => rowModel.rows, [rowModel]);

  const moveActiveCell = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (!activeCell) return;

      const rowIndex = visibleRows.findIndex(r => r.id === activeCell.rowId);
      const colIndex = visualColumnOrder.indexOf(activeCell.columnId);

      if (rowIndex === -1 || colIndex === -1) return;

      let nextRowIdx = rowIndex;
      let nextColIdx = colIndex;

      switch (direction) {
        case "up":
          nextRowIdx = Math.max(0, rowIndex - 1);
          break;
        case "down":
          nextRowIdx = Math.min(visibleRows.length - 1, rowIndex + 1);
          break;
        case "left":
          nextColIdx = Math.max(1, colIndex - 1); //1 prevents going to index column
          break;
        case "right":
          nextColIdx = Math.min(visualColumnOrder.length - 1, colIndex + 1);
          break;
      }

      if (nextRowIdx === rowIndex && nextColIdx === colIndex) return;

      const nextRow = visibleRows[nextRowIdx]!;
      const nextColId = visualColumnOrder[nextColIdx]!;

      setActiveCell({
        rowId: nextRow.id,
        columnId: nextColId,
      });

      if(rowVirtualizer){
        rowVirtualizer.scrollToIndex(nextRowIdx, { align: "auto" });
      }
    },
    [activeCell, visibleRows, visualColumnOrder, setActiveCell, rowVirtualizer]
  );

  /**
   * Preserve active cell on filter/sort/virtualization changes
   * If the active cell row is out of view, scroll to it.
   * If it no longer exists (filtered out), clear selection.
   */
  useEffect(() => {
    if (!activeCell) return;

    const rowIndex = visibleRows.findIndex(r => r.id === activeCell.rowId);

    if (rowIndex === -1) {
      // Row removed by filter -> clear selection
      setActiveCell(null);
      return;
    }

    if (rowVirtualizer) {
      const virtualItems = rowVirtualizer.getVirtualItems();
      const firstVisible = virtualItems[0]?.index ?? 0;
      const lastVisible = virtualItems[virtualItems.length - 1]?.index ?? visibleRows.length - 1;

      if (rowIndex < firstVisible || rowIndex > lastVisible) {
        // Row is out of viewport -> scroll to it
        rowVirtualizer.scrollToIndex(rowIndex, { align: "start" });
      }
    }
  }, [activeCell, visibleRows, rowVirtualizer, setActiveCell]);

  return moveActiveCell;
}
