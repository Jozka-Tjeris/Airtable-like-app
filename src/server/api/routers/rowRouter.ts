import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { normalizeCells, assertTableAccess } from "../routerUtils";
import { enqueueTableMutation } from "~/server/queue/tableQueue";

export const rowRouter = createTRPCRouter({
  getRowsWithCells: protectedProcedure
    .input(z.object({ tableId: z.string() }))
    .query(async ({ ctx, input }) => {
      await assertTableAccess(ctx, input.tableId);

      const rows = await ctx.db.row.findMany({
        where: { tableId: input.tableId },
        orderBy: { order: "asc" },
      });
      const cells = await ctx.db.cell.findMany({
        where: { rowId: { in: rows.map((r) => r.id) } },
      });
      return { rows, cells: normalizeCells(cells) };
    }),

  addRow: protectedProcedure
    .input(
      z.object({
        tableId: z.string(),
        orderNum: z.number(),
        optimisticId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertTableAccess(ctx, input.tableId);

      enqueueTableMutation({
        type: "addRow",
        tableId: input.tableId,
        optimisticId: input.optimisticId,
        order: input.orderNum,
        userId: ctx.session.user.id,
      });

      return { optimisticId: input.optimisticId };
    }),

  deleteRow: protectedProcedure
    .input(z.object({ tableId: z.string(), rowId: z.string() }))
    .mutation(async ({ input }) => {
      const mutationId = enqueueTableMutation({
        type: "deleteRow",
        tableId: input.tableId,
        rowId: input.rowId,
      });

      return { rowId: input.rowId, mutationId };
    }),
});
