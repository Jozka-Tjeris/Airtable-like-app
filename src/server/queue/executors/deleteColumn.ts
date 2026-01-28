import { db } from "~/server/db";
import type { DeleteColumnMutation } from "../mutationTypes";

export async function executeDeleteColumn(m: DeleteColumnMutation) {
  await db.cell.deleteMany({
    where: { columnId: m.columnId },
  });

  await db.column.delete({
    where: { id: m.columnId },
  });
}
