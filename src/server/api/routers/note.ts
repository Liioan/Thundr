import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const noteRouter = createTRPCRouter({
  createNote: protectedProcedure
    .input(
      z.object({
        noteTitle: z.string().optional(),
        noteType: z.string(),
        isMarkdown: z.boolean().optional(),
        daysAmount: z.number().optional(),
        reminderDate: z.string().optional(),
      })
    )
    .mutation(
      async ({
        input: { noteTitle, noteType, isMarkdown, daysAmount, reminderDate },
        ctx,
      }) => {
        switch (noteType) {
          case "note":
            const data = {
              title: noteTitle ?? "untitled",
              isMarkdown: isMarkdown ?? false,
              content: null,
              reminderDate: reminderDate ?? null,
              userId: ctx.session.user.id,
            };
            await ctx.prisma.note.create({ data });
            break;
        }
        return { noteCreated: true };
      }
    ),
});
