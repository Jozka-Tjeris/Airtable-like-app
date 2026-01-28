import { db } from "~/server/db";
import type { DeleteTableMutation } from "../mutationTypes";

export async function executeDeleteTable(m: DeleteTableMutation) {
  // Explicit cleanup (same as before, but no tx)
  await db.cell.deleteMany({
    where: { row: { tableId: m.tableId } },
  });

  await db.row.deleteMany({
    where: { tableId: m.tableId },
  });

  await db.column.deleteMany({
    where: { tableId: m.tableId },
  });

  await db.view.deleteMany({
    where: { tableId: m.tableId },
  });

  await db.table.deleteMany({
    where: { id: m.tableId },
  });
}
