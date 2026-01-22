"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, 
  type ReactNode, useRef, useEffect 
} from "react";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel,
  type ColumnDef, type SortingState, type ColumnFiltersState, type VisibilityState,
  type ColumnSizingState, type Table, type CellContext 
} from "@tanstack/react-table";
import type {
  Column, Row, CellMap, CellValue,TableRow, ColumnType 
} from "./tableTypes";
import { TableCell } from "../TableCell";
import { api as trpc } from "~/trpc/react";
import { useTableLayout } from "./useTableLayout";
import { useTableInteractions } from "./useTableInteractions";
import { useTableStructure } from "./useTableStructure";

export type TableProviderState = {
  rows: TableRow[];
  columns: Column[];
  cells: CellMap;
  activeCell: { rowId: string; columnId: string } | null;
  globalSearch: string;
  setActiveCell: (cell: { rowId: string; columnId: string } | null) => void;
  setGlobalSearch: (search: string) => void;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
  updateCell: (rowId: string, columnId: string, value: CellValue) => void;
  handleAddRow: (orderNum: number) => void;
  handleDeleteRow: (rowId: string) => void;
  handleAddColumn: (orderNum: number, label: string, type: ColumnType) => void;
  handleDeleteColumn: (columnId: string) => void;
  handleRenameColumn: (columnId: string, newLabel: string) => void;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  columnSizing: ColumnSizingState;
  table: Table<TableRow>;
  headerHeight: number;
  setHeaderHeight: (height: number) => void;
  getIsStructureStable: () => boolean;
  isNumericalValue: (val: string) => boolean;
  startVerticalResize: (e: React.MouseEvent) => void;
  ROW_HEIGHT: number;
};

const TableContext = createContext<TableProviderState | undefined>(undefined);

export const useTableController = () => {
  const ctx = useContext(TableContext);
  if (!ctx)
    throw new Error("useTableController must be used within TableProvider");
  return ctx;
};

type TableProviderProps = {
  children: ReactNode;
  tableId: string;
  initialRows: Row[];
  initialColumns: Column[];
  initialCells: CellMap;
  initialGlobalSearch?: string;
};

export function TableProvider({
  children,
  tableId,
  initialRows,
  initialColumns,
  initialCells,
  initialGlobalSearch = "",
}: TableProviderProps) {
  const [rows, setRows] = useState<TableRow[]>(() =>
    initialRows.map((r) => ({ ...r, internalId: r.internalId ?? r.id })),
  );
  const [columns, setColumns] = useState<Column[]>(() =>
    initialColumns.map((c) => ({
      ...c,
      internalId: c.id,
      columnType: c.columnType,
    })),
  );
  const [cells, setCells] = useState<CellMap>(initialCells);

  // Sync refs to rows/columns so updateCell doesn't need them in dependency array
  const rowsRef = useRef(rows);
  const columnsRef = useRef(columns);
  useEffect(() => { rowsRef.current = rows; }, [rows]);
  useEffect(() => { columnsRef.current = columns; }, [columns]);

  const [globalSearch, setGlobalSearch] = useState<string>(initialGlobalSearch);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  useEffect(() => {
    if (initialRows.length > 0) {
      setRows(initialRows.map((r) => ({ ...r, internalId: r.internalId ?? r.id })));
    }
  }, [initialRows]);

  useEffect(() => {
    if (initialColumns.length > 0) {
      setColumns(initialColumns.map((c) => ({ ...c, internalId: c.id, columnType: c.columnType })));
    }
  }, [initialColumns]);

  useEffect(() => {
    if (Object.keys(initialCells).length > 0) {
      setCells(initialCells);
    }
  }, [initialCells]);

  const { ROW_HEIGHT, headerHeight, columnSizing, 
    setHeaderHeight, startVerticalResize, setColumnSizing 
  } = useTableLayout()

  const { activeCell, pendingCellUpdatesRef, cellRefs, 
    setActiveCell, registerRef, updateCell, isNumericalValue 
  } = useTableInteractions(null, tableId, rowsRef, columnsRef);

  const { handleAddRow, handleDeleteRow, 
    handleAddColumn, handleDeleteColumn, handleRenameColumn, 
    getIsStructureStable, structureMutationInFlightRef 
  } = useTableStructure(tableId, setRows, setColumns, columnsRef);

  const updateCellsMutation = trpc.cell.updateCells.useMutation();

  useEffect(() => {
    const interval = setInterval(() => {
      if (structureMutationInFlightRef.current > 0) return;
      if (pendingCellUpdatesRef.current.length === 0) return;

      const updatesToSend = [...pendingCellUpdatesRef.current];
      pendingCellUpdatesRef.current = [];

      updateCellsMutation.mutate(updatesToSend);
    }, 300); // every 300ms, adjust as needed

    return () => clearInterval(interval);
  }, [updateCellsMutation, pendingCellUpdatesRef, structureMutationInFlightRef]);

  // STABLE DATA: We return original row references
  const tableData = useMemo(() => {
    const sorted = [...rows].sort((a, b) => a.order - b.order);
    const search = globalSearch.trim().toLowerCase();
    if (!search) return sorted;

    return sorted.filter((row) => {
      const rId = row.internalId ?? row.id;
      return columns.some((col) => {
        const cId = col.internalId ?? col.id;
        const value = cells[`${rId}:${cId}`];
        return value != null && String(value).toLowerCase().includes(search);
      });
    });
  }, [rows, columns, cells, globalSearch]);

  // Define this inside TableProvider but BEFORE tableColumns
  const CellRenderer = useCallback((info: CellContext<TableRow, CellValue>) => {
    const colId = info.column.id;
    const rowElem = info.row.original;
    const rId = rowElem.internalId ?? rowElem.id;
    const cellKey = `${rId}:${colId}`;
    const resolvedType = info.column.columnDef.meta?.columnType ?? "text";
    
    // Get the most recent value directly from the table state
    // This ensures the value is never stale even if the column def doesn't re-run
    const val = info.getValue();

    return (
      <TableCell
        cellId={cellKey}
        value={val} // info.getValue() is updated by TanStack automatically
        rowId={rId}
        columnId={colId}
        columnType={resolvedType}
        onClick={() => setActiveCell({ rowId: rId, columnId: colId })}
        onChange={(value) => updateCell(rId, colId, value)}
        registerRef={registerRef}
      />
    );
  }, [updateCell, registerRef, setActiveCell]); // Note: cells is NOT a dependency here

  const tableColumns = useMemo<ColumnDef<TableRow, CellValue>[]>(() => {
    return columns.map((col) => {
      const colId = col.internalId ?? col.id;
      return {
        id: colId,
        accessorFn: (row) => cells[`${row.internalId ?? row.id}:${colId}`] ?? "",
        header: col.label,
        size: col.width ?? 150,
        minSize: 100,
        maxSize: 800,
        meta: { columnType: col.columnType ?? "text", dbId: col.id },
        // Use the stable renderer function
        cell: CellRenderer,
      };
    });
    // We include cells here so the accessorFn updates, 
    // but because CellRenderer is stable, the TableCell won't unmount.
  }, [columns, cells, CellRenderer]);

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    state: { sorting, columnFilters, columnVisibility, columnSizing },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnSizingChange: setColumnSizing,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.internalId ?? row.id,
    columnResizeMode: "onChange",
  });

  // Focus effect
  useEffect(() => {
    if (!activeCell) return;
    const el = cellRefs.current[`${activeCell.rowId}:${activeCell.columnId}`];
    if (
      el &&
      document.activeElement?.tagName !== "INPUT" &&
      document.activeElement !== el
    ) {
      el.focus();
    }
  }, [activeCell, cellRefs]);

  const contextValue = useMemo(
    () => ({
      rows,
      columns,
      cells,
      activeCell,
      globalSearch,
      setActiveCell,
      setGlobalSearch,
      registerRef,
      updateCell,
      handleAddRow,
      handleDeleteRow,
      handleAddColumn,
      handleDeleteColumn,
      handleRenameColumn,
      getIsStructureStable,
      isNumericalValue,
      table,
      sorting,
      columnFilters,
      columnSizing,
      headerHeight,
      setHeaderHeight,
      startVerticalResize,
      ROW_HEIGHT,
    }),
    [
      rows,
      columns,
      cells,
      activeCell,
      globalSearch,
      columnFilters,
      columnSizing,
      table,
      sorting,
      headerHeight,
      registerRef,
      updateCell,
      handleAddRow,
      handleDeleteRow,
      handleAddColumn,
      handleDeleteColumn,
      handleRenameColumn,
      getIsStructureStable,
      isNumericalValue,
      startVerticalResize,
      setActiveCell,
      setHeaderHeight,
      ROW_HEIGHT,
    ],
  );

  return (
    <TableContext.Provider value={contextValue}>
      {children}
    </TableContext.Provider>
  );
}
