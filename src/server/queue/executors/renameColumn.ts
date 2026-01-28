import { db } from "~/server/db";
import type { RenameColumnMutation } from "../mutationTypes";

export async function executeRenameColumn(m: RenameColumnMutation) {
  // col may already deleted (idempotency)
  await db.column.updateMany({
    where: {
      id: m.columnId,
      tableId: m.tableId,
    },
    data: {
      name: m.newLabel,
    },
  });
}
