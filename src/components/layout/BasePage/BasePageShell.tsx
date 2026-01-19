"use client"

import { LeftBar } from "./LeftBar";
import { TopBar } from "./TopBar";
import { TableSelectionBar } from "./TableSelectionBar";
import { GridViewBar } from "./GridViewBar";
import { ViewSelectorBar } from "./ViewSelectorBar";
import { MainContent } from "./MainContent";
import { TableProvider, TEST_TABLE_ID } from "~/components/table/controller/TableProvider";
import { api as trpc } from "~/trpc/react";
import type { CellMap, ColumnType } from "~/components/table/controller/tableTypes";

interface BasePageShellProps {
  baseId: string;
}

export function BasePageShell({ baseId }: BasePageShellProps) {
  const tablesQuery = trpc.table.listTablesByBaseId.useQuery({ baseId });

  // Only pick tableId if data exists
  const tableId = tablesQuery.data?.[0]?.id;

  // Queries always called, but conditionally enabled
  const rowsQuery = trpc.row.getRowsWithCells.useQuery(
    { tableId: tableId || "" },
    { enabled: !!tableId }
  );

  const columnsQuery = trpc.column.getColumns.useQuery(
    { tableId: tableId || "" },
    { enabled: !!tableId }
  );

  if (tablesQuery.isLoading) return <div>Loading tables…</div>;
  if (!tablesQuery.data || tablesQuery.data.length === 0) return <div>No tables found</div>;
  if (rowsQuery.isLoading || columnsQuery.isLoading) return <div>Loading table…</div>;
  if (!rowsQuery.data || !columnsQuery.data) return <div>Failed to load table</div>;

  const backendCells = rowsQuery.data.cells;

  const initialRows = rowsQuery.data.rows.map((row, index) => ({
    id: row.id,
    order: (index + 1),
  }))

  const initialCells = backendCells as CellMap;

  const initialColumns = columnsQuery.data.columns.map((col, index) => ({
    id: col.id,
    label: col.name,
    order: (index + 1),
    columnType: col.columnType as ColumnType
  }))

  return <TableProvider
      initialRows={initialRows}
      initialColumns={initialColumns}
      initialCells={initialCells}
    >
      <div className="flex flex-row h-screen w-full overflow-hidden">
      <LeftBar />
      <div className="flex flex-col flex-1 min-w-0 min-h-0">
        <TopBar />
        <TableSelectionBar />
        <GridViewBar />
        <div className="flex flex-row flex-1 min-w-0 min-h-0">
          <ViewSelectorBar />
          <main className="flex-1 min-w-0 min-h-0">
              <MainContent/>
            </main>
        </div>
      </div>
    </div>
  </TableProvider>
}
