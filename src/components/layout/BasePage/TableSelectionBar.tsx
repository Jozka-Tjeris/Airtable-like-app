import type { TableData } from "~/components/table/controller/tableTypes";

interface TableSelectionBarProps {
  tables: TableData[];
  activeTableId: string | null;
  onTableSelect: (tableId: string) => void;
  onCreateTable: () => void;
  onDeleteTable: (tableId: string) => void;
  onRenameTable: (tableId: string) => void;
  creatingTable: boolean;
}

export function TableSelectionBar({
  tables,
  activeTableId,
  onTableSelect,
  onCreateTable,
  onDeleteTable,
  onRenameTable,
  creatingTable,
}: TableSelectionBarProps) {
  return (
    <div className="h-8 shrink-0 border-t border-gray-300 bg-blue-100">
      <div className="flex h-full items-stretch">
        {tables.map((table) => {
          const isActive = table.id === activeTableId;

          return (
            <div
              key={table.id}
              className={`flex h-full cursor-pointer items-center border-r px-2 select-none ${isActive ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-white hover:bg-gray-100"} `}
              onClick={() => onTableSelect(table.id)}
              onDoubleClick={() => onRenameTable(table.id)}
            >
              <span className="max-w-[120px] truncate">{table.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent selecting tab
                  onDeleteTable(table.id);
                }}
                className="ml-2 text-xs text-black hover:text-red-500"
                title="Delete table"
              >
                ✕
              </button>
            </div>
          );
        })}

        {/* Add table */}
        <button
          onClick={onCreateTable}
          disabled={creatingTable}
          className="flex h-full items-center border-r bg-white px-3 text-sm font-medium hover:bg-gray-100"
        >
          + Add table
        </button>
      </div>
    </div>
  );
}
