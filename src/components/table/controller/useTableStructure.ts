import { useCallback, useRef } from "react";
import type { TableRow, Column, ColumnType } from "./tableTypes";
import { api as trpc } from "~/trpc/react";

export function useTableStructure(
  tableId: string,
  setRows: React.Dispatch<React.SetStateAction<TableRow[]>>,
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>,
  columnsRef: React.RefObject<Column[]>,
  isViewDirty: boolean,
  onStructureCommitted: () => void,
) {
  const structureMutationInFlightRef = useRef(0);

  const beginStructureMutation = () => {
    structureMutationInFlightRef.current += 1;
  };

  const endStructureMutation = () => {
    structureMutationInFlightRef.current -= 1;
  };

  const getIsStructureStable = useCallback(
    () => structureMutationInFlightRef.current === 0,
    []
  );

  // IDs are guaranteed to be correct because it only commits after in-flight count hits zero
  const maybeCommitStructure = () => {
    if (structureMutationInFlightRef.current === 0) {
      onStructureCommitted();
    }
  };

  const addRowMutation = trpc.row.addRow.useMutation({
    onMutate: () => beginStructureMutation(),
    onSuccess: ({ row, optimisticId }) => {
      setRows((prev) =>
        prev.map((r) =>
          r.internalId === optimisticId || r.id === optimisticId
            ? { ...r, id: row.id, optimistic: false }
            : r
        )
      );
    },
    onError: (_, { optimisticId }) => {
      setRows((prev) => prev.filter((r) => r.id !== optimisticId));
    },
    onSettled: () => {
      endStructureMutation();
      maybeCommitStructure();
    },
  });

  const addColumnMutation = trpc.column.addColumn.useMutation({
    onMutate: () => beginStructureMutation(),
    onSuccess: ({ column, optimisticId }) => {
      setColumns((prev) =>
        prev.map((c) =>
          c.id === optimisticId || c.internalId === optimisticId
            ? { ...c, id: column.id, optimistic: false, label: column.name, order: column.order }
            : c
        )
      );
    },
    onError: (_, { optimisticId }) => {
      setColumns(prev => prev.filter(c => c.id !== optimisticId && c.internalId !== optimisticId));
    },
    onSettled: () => {
      endStructureMutation();
      maybeCommitStructure();
    },
  });

  const deleteRowMutation = trpc.row.deleteRow.useMutation({
    onSettled: () => {
      endStructureMutation();
      maybeCommitStructure();
    }
  });
  const deleteColumnMutation = trpc.column.deleteColumn.useMutation({
    onSettled: () => {
      endStructureMutation();
      maybeCommitStructure();
    }
  });
  const renameColumnMutation = trpc.column.renameColumn.useMutation({
    onMutate: () => beginStructureMutation(),
    onSettled: () => {
      endStructureMutation();
      maybeCommitStructure();
    }
  });

  const confirmStructuralChange = useCallback((action: string) => {
    return confirm(
      `${action}\n\nStructural changes are applied immediately and automatically saved to this view.`
    );
  }, []);

  const handleAddRow = useCallback(
    (orderNum: number) => {
      if(columnsRef.current.length === 0) return;
      if(isViewDirty){
        alert("The current view must be saved before adding any rows");
        return;
      }
      if(!confirmStructuralChange("Do you want to add a row?")) return;
      const optimisticId = `optimistic-row-${crypto.randomUUID()}`;
      setRows((prev) => [
        ...prev,
        {
          id: optimisticId,
          internalId: optimisticId,
          order: orderNum,
          optimistic: true,
        },
      ]);
      addRowMutation.mutate({ tableId, orderNum, optimisticId });
    },
    [addRowMutation, tableId, setRows, columnsRef, isViewDirty, confirmStructuralChange]
  );

  const handleAddColumn = useCallback(
    (orderNum: number) => {
      if(isViewDirty){
        alert("The current view must be saved before adding any columns");
        return;
      }
      if(!confirmStructuralChange("Do you want to add a column?")) return;
      const colLabel = prompt("Enter column name:", `Column ${orderNum + 1}`);
      if (!colLabel) return;
      const typeInput = prompt(
        "Enter column type (text, number) [default is text]:",
        "text",
      );
      if (typeInput === null) return;
      const type: ColumnType = typeInput.toLowerCase().trim() === "number" ? "number" : "text";

      const optimisticId = `optimistic-col-${crypto.randomUUID()}`;
      setColumns((prev) => [
        ...prev,
        {
          id: optimisticId,
          internalId: optimisticId,
          label: colLabel,
          order: orderNum,
          columnType: type,
          optimistic: true,
        },
      ]);
      addColumnMutation.mutate({ tableId, label: colLabel, orderNum, type, optimisticId });
    },
    [addColumnMutation, tableId, setColumns, isViewDirty, confirmStructuralChange]
  );

  const handleDeleteRow = useCallback(
    (rowId: string, rowPosition: number) => {
      if(isViewDirty){
        alert("The current view must be saved before deleting any rows");
        return;
      }
      if(!confirmStructuralChange(`Delete row "${rowPosition}"?\n\nThis will remove all its cell values.`)) return;
      beginStructureMutation();
      setRows((prev) => prev.filter((r) => r.id !== rowId && r.internalId !== rowId));
      deleteRowMutation.mutate({ tableId, rowId });
    },
    [deleteRowMutation, tableId, setRows, isViewDirty, confirmStructuralChange]
  );

  const handleDeleteColumn = useCallback(
    (columnId: string) => {
      if(isViewDirty){
        alert("The current view must be saved before deleting any columns");
        return;
      }
      if(!confirmStructuralChange("Do you want to delete this column?")) return;
      beginStructureMutation();
      setColumns((prev) => prev.filter((c) => c.id !== columnId && c.internalId !== columnId));
      deleteColumnMutation.mutate({ tableId, columnId });
    },
    [deleteColumnMutation, tableId, setColumns, isViewDirty, confirmStructuralChange]
  );

  const handleRenameColumn = useCallback(
    (columnId: string) => {
      if(isViewDirty){
        alert("The current view must be saved before renaming any columns");
        return;
      }
      if(!confirmStructuralChange("Do you want to rename this column?")) return;
      const newLabel = prompt("Enter new column name:");
      if (!newLabel || newLabel.trim() === ""){
        alert("Column name is invalid.");
        return;
      }
      setColumns((prev) =>
        prev.map((c) =>
          c.id === columnId || c.internalId === columnId ? { ...c, label: newLabel } : c
        )
      );
      renameColumnMutation.mutate({ tableId, columnId, newLabel });
    },
    [renameColumnMutation, tableId, setColumns, isViewDirty, confirmStructuralChange]
  );

  return {
    handleAddRow,
    handleAddColumn,
    handleDeleteRow,
    handleDeleteColumn,
    handleRenameColumn,
    getIsStructureStable,
    structureMutationInFlightRef,
  };
}
