import { db } from "~/server/db";
import type { UpdateViewMutation } from "../mutationTypes";

export async function executeUpdateView(m: UpdateViewMutation) {
  if (m.isDefault) {
    await db.view.updateMany({
      where: { tableId: m.tableId, isDefault: true },
      data: { isDefault: false },
    });
  }

  await db.view.updateMany({
    where: { id: m.viewId },
    data: {
      ...(m.name && { name: m.name }),
      ...(m.config && { config: m.config }),
      ...(typeof m.isDefault === "boolean" && { isDefault: m.isDefault }),
    },
  });
}
