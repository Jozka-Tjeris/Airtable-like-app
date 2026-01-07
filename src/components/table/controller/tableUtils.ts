import { type CellKey } from "./tableTypes";

export function getCellValue(cells: Record<CellKey, any>, rowId: string, columnId: string) {
  const key = `${rowId}:${columnId}`;
  return cells[key];
}

export function isActiveCell(activeCell: { rowId: string; columnId: string } | null, rowId: string, columnId: string) {
  return activeCell?.rowId === rowId && activeCell?.columnId === columnId;
}
