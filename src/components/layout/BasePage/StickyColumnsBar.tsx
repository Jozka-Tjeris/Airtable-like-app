"use client";

import { memo } from "react";
import { useTableController } from "@/components/table/controller/TableProvider";

interface StickyProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

// Use memo so this doesn't re-render unless rows/columns actually change
export const StickyColumnsBar = memo(function StickyColumnsBar({
  scrollRef,
}: StickyProps) {
  const { table, headerHeight } = useTableController();

  // Get the rows EXACTLY as they appear in the main table (sorted/filtered)
  const sortedRows = table.getRowModel().rows;

  return (
    <div
      ref={scrollRef}
      className="no-scrollbar pointer-events-none flex w-[60px] flex-none flex-col overflow-y-hidden border-r border-gray-300 bg-gray-50"
      style={{ height: "100%" }}
    >
      <div
        style={{
          height: headerHeight,
          minHeight: headerHeight,
          boxSizing: "border-box",
        }}
        className="border-b bg-gray-100"
      />

      {sortedRows.map((row) => (
        <div
          key={row.id}
          className="flex items-center justify-center border-b"
          style={{ height: "40px", minHeight: "40px" }}
        >
          {/* Example: Row Index or Selector */}
          <span className="text-xs text-gray-400">{row.index + 1}</span>
        </div>
      ))}
    </div>
  );
});
