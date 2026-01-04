import { columns, type Row } from "./mockTableData";
import { TableCell } from "./TableCell";

export function TableRow({ row }: { row: Row }) {
  return (
    <div className="flex border-b hover:bg-gray-50">
      {columns.map(col => (
        <TableCell key={col.id} value={String(row[col.id])} />
      ))}
    </div>
  );
}