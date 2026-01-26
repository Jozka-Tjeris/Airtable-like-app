import { useCallback, useRef } from "react";
import type { TableRow, Column, ColumnType } from "./tableTypes";
import { api as trpc } from "~/trpc/react";

export function useTableStructure(
  tableId: string,
  setRows: React.Dispatch<React.SetStateAction<TableRow[]>>,
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>,
  columnsRef: React.RefObject<Column[]>
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
    onSettled: () => endStructureMutation(),
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
    onSettled: () => endStructureMutation(),
  });

  const deleteRowMutation = trpc.row.deleteRow.useMutation();
  const deleteColumnMutation = trpc.column.deleteColumn.useMutation();
  const renameColumnMutation = trpc.column.renameColumn.useMutation();

  const handleAddRow = useCallback(
    (orderNum: number) => {
      if (columnsRef.current.length === 0) return;
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
    [addRowMutation, tableId, setRows, columnsRef]
  );

  const handleAddColumn = useCallback(
    (orderNum: number, label: string, type: ColumnType) => {
      const optimisticId = `optimistic-col-${crypto.randomUUID()}`;
      setColumns((prev) => [
        ...prev,
        {
          id: optimisticId,
          internalId: optimisticId,
          label,
          order: orderNum,
          columnType: type,
          optimistic: true,
        },
      ]);
      addColumnMutation.mutate({ tableId, label, orderNum, type, optimisticId });
    },
    [addColumnMutation, tableId, setColumns]
  );

  const handleDeleteRow = useCallback(
    (rowId: string) => {
      beginStructureMutation();
      setRows((prev) => prev.filter((r) => r.id !== rowId && r.internalId !== rowId));
      deleteRowMutation.mutate({ tableId, rowId }, { onSettled: endStructureMutation });
    },
    [deleteRowMutation, tableId, setRows]
  );

  const handleDeleteColumn = useCallback(
    (columnId: string) => {
      beginStructureMutation();
      setColumns((prev) => prev.filter((c) => c.id !== columnId && c.internalId !== columnId));
      deleteColumnMutation.mutate({ tableId, columnId }, { onSettled: endStructureMutation });
    },
    [deleteColumnMutation, tableId, setColumns]
  );

  const handleRenameColumn = useCallback(
    (columnId: string, newLabel: string) => {
      setColumns((prev) =>
        prev.map((c) =>
          c.id === columnId || c.internalId === columnId ? { ...c, label: newLabel } : c
        )
      );
      renameColumnMutation.mutate({ tableId, columnId, newLabel });
    },
    [renameColumnMutation, tableId, setColumns]
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
