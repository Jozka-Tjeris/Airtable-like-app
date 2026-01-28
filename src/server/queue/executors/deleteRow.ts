import { db } from "~/server/db";
import type { DeleteRowMutation } from "../mutationTypes";

export async function executeDeleteRow(m: DeleteRowMutation) {
  // Order matters: delete cells first to avoid FK issues
  await db.cell.deleteMany({
    where: { rowId: m.rowId },
  });

  await db.row.delete({
    where: { id: m.rowId },
  });
}
