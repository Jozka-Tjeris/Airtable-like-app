import { db } from "~/server/db";
import type { RenameTableMutation } from "../mutationTypes";

export async function executeRenameTable(m: RenameTableMutation) {
  await db.table.updateMany({
    where: { id: m.tableId },
    data: { name: m.newName },
  });
}
