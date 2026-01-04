import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";

export function BaseTable() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="min-w-[800px]">
        <TableHeader />
        <TableBody />
      </div>
    </div>
  );
}