// src/server/api/routers/base.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const baseRouter = createTRPCRouter({
  // ------------------
  // Queries
  // ------------------

  listBases: protectedProcedure.query(({ ctx }) => {
    return ctx.db.base.findMany({
      where: { ownerId: ctx.session.user.id },
      orderBy: { updatedAt: "desc" },
    });
  }),

  getBaseById: protectedProcedure
    .input(z.object({ baseId: z.string().min(1) }))
    .query(({ ctx, input }) => {
        return ctx.db.base.findUnique({
            where: { ownerId: ctx.session.user.id, id: input.baseId }
        })
    }),

  // ------------------
  // Mutations
  // ------------------

  createBase: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.base.create({
        data: {
          name: input.name,
          ownerId: ctx.session.user.id,
        },
      });
    }),

  renameBase: protectedProcedure
    .input(z.object({ baseId: z.string(), name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.base.updateMany({
        where: {
          id: input.baseId,
          ownerId: ctx.session.user.id,
        },
        data: { name: input.name },
      });

      if (result.count === 0) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return { baseId: input.baseId };
    }),

  deleteBase: protectedProcedure
    .input(z.object({ baseId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$transaction(async (tx) => {
        const base = await tx.base.findFirst({
          where: {
            id: input.baseId,
            ownerId: ctx.session.user.id,
          },
          select: { id: true },
        });

        if (!base) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        // Explicit cleanup (even though cascades exist)
        const tables = await tx.table.findMany({
          where: { baseId: input.baseId },
          select: { id: true },
        });

        const tableIds = tables.map(t => t.id);

        await tx.cell.deleteMany({
          where: {
            row: { tableId: { in: tableIds } },
          },
        });

        await tx.row.deleteMany({
          where: { tableId: { in: tableIds } },
        });

        await tx.column.deleteMany({
          where: { tableId: { in: tableIds } },
        });

        await tx.view.deleteMany({
          where: { tableId: { in: tableIds } },
        });

        await tx.table.deleteMany({
          where: { baseId: input.baseId },
        });

        await tx.base.delete({
          where: { id: input.baseId },
        });
      });

      return { baseId: input.baseId };
    }),
});
