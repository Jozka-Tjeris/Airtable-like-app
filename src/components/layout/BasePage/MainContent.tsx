"use client"

import { BaseTable } from "~/components/table/BaseTable";
import { StickyColumnsBar } from "./StickyColumnsBar";
import { useTableController } from "~/components/table/controller/TableProvider";
import { useEffect, useRef } from "react";

export function MainContent() {
  const { setActiveCell, activeCell } = useTableController();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!activeCell) return;
      // If the click is NOT in the sidebar AND NOT in the table
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveCell(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeCell, setActiveCell]);

  return (
    <div ref={containerRef} className="flex flex-auto">
      <StickyColumnsBar />
      <div className="overflow-auto flex-1">
        <BaseTable />
      </div>
    </div>
  );
}
