import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const viewsRouter = createTRPCRouter({
  // --------------------
  // Fetch all views for a table
  // --------------------
  getViews: protectedProcedure
    .input(z.object({ tableId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.view.findMany({
        where: { tableId: input.tableId },
        orderBy: { createdAt: "asc" },
      });
    }),

  // --------------------
  // Fetch a single view by ID
  // --------------------
  getView: protectedProcedure
    .input(z.object({ viewId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.view.findUnique({
        where: { id: input.viewId },
      });
    }),

  getDefaultView: protectedProcedure
    .input(z.object({ tableId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.view.findFirst({
        where: { tableId: input.tableId, isDefault: true },
      });
    }),

  // --------------------
  // Create a new view
  // --------------------
  createView: protectedProcedure
    .input(
      z.object({
        tableId: z.string(),
        name: z.string().min(1),
        config: z.any(), // Can refine later to match CachedTableState
        isDefault: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // If isDefault is true, unset any other default view for this table
      if (input.isDefault) {
        await ctx.db.view.updateMany({
          where: { tableId: input.tableId, isDefault: true },
          data: { isDefault: false },
        });
      }

      return ctx.db.view.create({
        data: {
          tableId: input.tableId,
          name: input.name,
          config: input.config,
          isDefault: input.isDefault,
        },
      });
    }),

  // --------------------
  // Update an existing view
  // --------------------
  updateView: protectedProcedure
    .input(
      z.object({
        viewId: z.string(),
        name: z.string().optional(),
        config: z.any().optional(), // Can refine to CachedTableState
        isDefault: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updateData: any = {};
      if (input.name) updateData.name = input.name;
      if (input.config) updateData.config = input.config;
      if (typeof input.isDefault === "boolean") {
        // Unset previous default if this one is now default
        if (input.isDefault) {
          const view = await ctx.db.view.findUnique({
            where: { id: input.viewId },
            select: { tableId: true },
          });
          if (view) {
            await ctx.db.view.updateMany({
              where: { tableId: view.tableId, isDefault: true },
              data: { isDefault: false },
            });
          }
        }
        updateData.isDefault = input.isDefault;
      }

      return ctx.db.view.update({
        where: { id: input.viewId },
        data: updateData,
      });
    }),

  // --------------------
  // Delete a view
  // --------------------
  deleteView: protectedProcedure
    .input(z.object({ viewId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.view.delete({
        where: { id: input.viewId },
      });
      return { success: true };
    }),
});
