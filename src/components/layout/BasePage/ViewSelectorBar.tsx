"use client";

import { useState, useEffect, useRef} from "react";
import { api as trpc } from "~/trpc/react";
import { useTableController } from "~/components/table/controller/TableProvider";
import isEqual from "fast-deep-equal";

interface ViewSelectorBarProps {
  tableId: string;
}

export function ViewSelectorBar({ tableId }: ViewSelectorBarProps) {
  const { table, globalSearch, setGlobalSearch, setActiveCell } = useTableController();

  const [newViewName, setNewViewName] = useState("");
  const [activeViewId, setActiveViewId] = useState<string | null>(null);
  const [activeViewConfig, setActiveViewConfig] = useState<any | null>(null);

  // Fetch all views for this table
  const viewsQuery = trpc.views.getViews.useQuery({ tableId });

  const defaultViewQuery = trpc.views.getDefaultView.useQuery(
    { tableId },
    { enabled: !!tableId }
  );

  const hasHydratedDefaultViewRef = useRef(false);
  // Get default view if available
  useEffect(() => {
    if (hasHydratedDefaultViewRef.current) return;
    if (!defaultViewQuery.data) return;
    if (!viewsQuery.data) return;

    applyView(defaultViewQuery.data);
    hasHydratedDefaultViewRef.current = true;
  }, [defaultViewQuery.data, viewsQuery.data]);

  const createViewMutation = trpc.views.createView.useMutation({
    onSuccess: () => {
      setNewViewName("");
      viewsQuery.refetch();
    },
  });

  const updateViewMutation = trpc.views.updateView.useMutation({
    onSuccess: () => viewsQuery.refetch(),
  });

  const getCurrentConfig = () => ({
    sorting: table.getState().sorting,
    columnFilters: table.getState().columnFilters,
    columnVisibility: table.getState().columnVisibility,
    columnSizing: table.getState().columnSizing,
    columnPinning: table.getState().columnPinning,
    globalSearch: globalSearch,
  });

  const applyView = (view: { id: string; config: any }) => {
    if (!view?.config) return;

    const {
      sorting,
      columnFilters,
      columnVisibility,
      columnSizing,
      columnPinning,
      globalSearch,
    } = view.config;

    table.setSorting(sorting ?? []);
    table.setColumnFilters(columnFilters ?? []);
    table.setColumnVisibility(columnVisibility ?? {});
    table.setColumnSizing(columnSizing ?? {});
    table.setColumnPinning(columnPinning ?? { left: [], right: [] });

    setGlobalSearch(globalSearch ?? "");
    setActiveCell(null);

    setActiveViewId(view.id);
    setActiveViewConfig(view.config);
  };

  const handleCreateView = () => {
    if (!newViewName.trim()) return;

    createViewMutation.mutate({
      tableId,
      name: newViewName,
      config: getCurrentConfig(),
      isDefault: false,
    });
  };

  const handleUpdateView = () => {
    if (!activeViewId) return;

    updateViewMutation.mutate({
      viewId: activeViewId,
      config: getCurrentConfig(),
    });
  };

  const isDirty = activeViewConfig && !isEqual(getCurrentConfig(), activeViewConfig);

  return (
    <div className="border-gray-750 w-70 shrink-0 border-r bg-gray-50 p-2 flex flex-col">
      <h4 className="mb-2 font-bold">Views</h4>

      <div className="flex flex-col gap-1 overflow-y-auto">
        {viewsQuery.data?.map((view) => (
          <button
            key={view.id}
            className={`flex items-center justify-between text-left p-1 rounded ${
              activeViewId === view.id
                ? "bg-gray-200 font-medium"
                : "hover:bg-gray-100"
            }`}
            onClick={() => applyView(view)}
          >
            <span className="flex items-center gap-1 truncate">
              {view.isDefault && (
                <span className="text-xs text-blue-500">★</span>
              )}
              <span className="truncate">{view.name}</span>
            </span>

            {activeViewId === view.id && isDirty && (
              <span className="text-xs text-orange-500">Draft</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <input
          className="w-full border rounded p-1 text-sm"
          placeholder="New view name"
          value={newViewName}
          onChange={(e) => setNewViewName(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 text-white rounded p-1 text-sm hover:bg-blue-600 disabled:opacity-50"
          onClick={handleCreateView}
        >
          Save as New View
        </button>

        <button
          className="w-full bg-gray-200 text-gray-800 rounded p-1 text-sm hover:bg-gray-300 disabled:opacity-50"
          onClick={handleUpdateView}
          disabled={!activeViewId || !isDirty}
          title={
            !activeViewId
              ? "Select a view to update"
              : !isDirty
                ? "No changes to save"
                : undefined
          }
        >
          Update Selected View
        </button>
        <button
          className="w-full bg-gray-100 text-gray-700 rounded p-1 text-sm hover:bg-gray-200 disabled:opacity-50"
          disabled={!activeViewId || !isDirty}
          onClick={() => {
            const view = viewsQuery.data?.find(v => v.id === activeViewId);
            if (view) applyView(view);
          }}
        >
          Reset to View
        </button>
      </div>
    </div>
  );
}
