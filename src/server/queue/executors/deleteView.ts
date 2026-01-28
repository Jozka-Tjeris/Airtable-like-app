import { db } from "~/server/db";
import type { DeleteViewMutation } from "../mutationTypes";

export async function executeDeleteView(m: DeleteViewMutation) {
  const view = await db.view.findUnique({
    where: { id: m.viewId },
    select: { tableId: true, isDefault: true },
  });

  if (!view) return;

  if (view.isDefault) {
    const fallback = await db.view.findFirst({
      where: {
        tableId: view.tableId,
        id: { not: m.viewId },
      },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });

    if (fallback) {
      await db.view.update({
        where: { id: fallback.id },
        data: { isDefault: true },
      });
    }
  }

  await db.view.deleteMany({
    where: { id: m.viewId },
  });
}
