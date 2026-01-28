import { db } from "~/server/db";
import type { AddRowMutation } from "../mutationTypes";

export async function executeAddRow(m: AddRowMutation) {
  await db.row.create({
    data: {
      tableId: m.tableId,
      order: m.order,
    },
  });
  // Optional: persist optimisticId → real rowId mapping later
}
