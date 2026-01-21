"use client";

import { useTableController } from "~/components/table/controller/TableProvider";

export function GridViewBar() {
  const { globalSearch, setGlobalSearch } = useTableController();

  return (
    <div className="border-gray-750 h-12 shrink-0 border-b bg-gray-50">
      <div className="flex items-center justify-between border-b bg-white px-3 py-2">
        <div className="flex items-center gap-2">
          {/* Filters / Sort buttons later */}
        </div>

        <input
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          placeholder="Search"
          className="w-56 rounded border px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
}
