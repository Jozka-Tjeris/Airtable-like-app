"use client";

import { createContext, useContext } from "react";
import { type Table } from "@tanstack/react-table";

export type TableContextType<TData> = {
  table: Table<TData>;
};

export const TableContext = createContext<TableContextType<unknown> | null>(null);

export function useTableContext<TData>() {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTableContext must be used inside TableContext.Provider");
  }
  return context as TableContextType<TData>;
}
