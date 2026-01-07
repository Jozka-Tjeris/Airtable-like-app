"use client"

import { memo } from "react";
import { useTableController } from "@/components/table/controller/TableProvider";

// Use memo so this doesn't re-render unless rows/columns actually change
export const StickyColumnsBar = memo(function StickyColumnsBar() {
  const { rows } = useTableController();

  // REMOVED: activeCell, setActiveCell, and all useEffects.
  // Let BaseTable/MainContent handle the global state.

  return (
    <div
      className="flex flex-col flex-none w-[60px] bg-gray-50 border-r border-gray-300 overflow-hidden"
      style={{ position: "sticky", left: 0, zIndex: 20 }}
    >
      {rows.map((row) => (
        <div
          key={row.id}
          className="flex items-center justify-center border-b"
          style={{ height: "40px", minHeight: "40px" }}
        >
          {/* Example: Row Index or Selector */}
          <span className="text-xs text-gray-400">{row.order + 1}</span>
        </div>
      ))}
    </div>
  );
});