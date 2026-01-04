import { columns } from "./mockTableData";

export function TableHeader() {
  return (
    <div className="flex border-b bg-gray-50 sticky top-0 z-10">
      {columns.map(col => (
        <div key={col.id} className="w-48 px-2 py-1 font-medium text-sm border-r">
          {col.label}
        </div>
      ))}
    </div>
  );
}
