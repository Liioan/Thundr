import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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
      async ({ input: { noteTitle, isMarkdown, reminderDate }, ctx }) => {
        const data = {
          title: noteTitle?.length ? noteTitle : "untitled",
          isMarkdown: isMarkdown ?? false,
          content: null,
          reminderDate: reminderDate,
          userId: ctx.session.user.id,
        };
        const newNote = await ctx.prisma.note.create({ data });
        return newNote;
      }
    ),

  getNoteDetails: protectedProcedure
    .input(z.object({ noteId: z.string() }))
    .query(async ({ input: { noteId }, ctx }) => {
      const currentUserId = ctx.session.user.id;
      const noteData = await ctx.prisma.note.findUnique({
        where: {
          id: noteId,
        },
      });
      if (noteData?.userId !== currentUserId) return null;
      return noteData;
    }),

  getAllNotes: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input: { userId }, ctx }) => {
      const notes = await ctx.prisma.note.findMany({
        where: { userId: userId },
      });
      return notes;
    }),
});
