import { flexRender } from "@tanstack/react-table";
import { useTableContext } from "./TableContext";
import { useState, useCallback } from "react";
import type { Row } from "./mockTableData";

export function TableHeader() {
  const { table } = useTableContext<Row>();

  // Columns currently sorted (for blue highlight)
  const sortedColumnIds = table.getState().sorting.map(s => s.id);

  // Single height for all header rows
  const [headerHeight, setHeaderHeight] = useState(40); // default 40px

  const startVerticalResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = headerHeight;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientY - startY;
      setHeaderHeight(Math.max(32, startHeight + delta)); // min height 24px
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [headerHeight]);

  return (
    <thead className="border-b bg-gray-50">
      {table.getHeaderGroups().map(headerGroup => (
        <tr key={headerGroup.id} style={{ height: headerHeight }}>
          {headerGroup.headers.map(header => {
            const isActive = sortedColumnIds.includes(header.column.id);

            return (
              <th
                key={header.id}
                style={{ width: header.getSize(), tableLayout: 'fixed', height: headerHeight }}
                className={`relative px-4 py-2 text-left font-semibold select-none
                  ${isActive ? "bg-blue-100" : ""}`}
              >
                {header.isPlaceholder ? null : (
                  <>
                    {/* Header text top-left */}
                    <div
                      className="absolute top-1 left-1 pr-6"
                      style={{ lineHeight: 1.2 }}
                    >
                      <span
                        className="cursor-pointer hover:underline flex items-center"
                        onClick={() => header.column.getToggleSortingHandler()?.("")}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === "asc"
                          ? " ↑"
                          : header.column.getIsSorted() === "desc"
                          ? " ↓"
                          : ""}
                      </span>
                    </div>

                    {/* Filter button top-right */}
                    <button
                      className="absolute top-1 right-2 text-gray-400 hover:text-gray-700"
                      onClick={() => console.log("Filter clicked for:", header.column.id)}
                    >
                      ⏺
                    </button>

                    {/* --- RESIZE HANDLES --- */}

                    {/* Horizontal resize handle */}
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className="absolute right-0 top-0 h-full w-[1px] cursor-col-resize bg-gray-300 hover:bg-gray-500 z-10"
                      />
                    )}

                    {/* Vertical resize handle */}
                    <div
                      onMouseDown={startVerticalResize}
                      className="absolute bottom-0 left-0 w-full h-[1px] cursor-row-resize bg-gray-300 hover:bg-gray-500 z-10"
                    />
                  </>
                )}
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
}
