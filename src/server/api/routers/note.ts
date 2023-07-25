import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const noteRouter = createTRPCRouter({
  createNote: protectedProcedure
    .input(
      z.object({
        noteTitle: z.string().optional(),
        noteType: z.string(),
        daysAmount: z.number().optional(),
        reminderDate: z.string().optional(),
      })
    )
    .mutation(
      async ({
        input: { noteTitle, reminderDate, noteType, daysAmount },
        ctx,
      }) => {
        const createContent = () => {
          let data = "";

          if (noteType === "note" || noteType === "markdownNote") {
            data = JSON.stringify("");
          }
          if (noteType === "todoList") {
            data = JSON.stringify([]);
          }
          if (noteType === "progressTracker") {
            if (daysAmount == null) return;
            const content: { dayNumber: number; isFinished: boolean }[] = [];
            for (let i = 0; i < daysAmount; i++) {
              content.push({ dayNumber: i + 1, isFinished: false });
            }
            data = JSON.stringify(content);
          }
          if (noteType === "decisionTree") {
            data = JSON.stringify([]);
          }
          if (noteType === "counter") {
            data = JSON.stringify(0);
          }

          return data;
        };

        const noteTypeId = await ctx.prisma.noteType.findFirst({
          where: {
            type: noteType,
          },
        });

        if (noteTypeId == null) return;

        const newNote = await ctx.prisma.note.create({
          data: {
            title: noteTitle?.length ? noteTitle : "untitled",
            noteTypeId: noteTypeId.id,
            content: createContent() ?? "",
            reminderDate: reminderDate ?? undefined,
            userId: ctx.session.user.id,
          },
        });

        return newNote;
      }
    ),

  editNote: protectedProcedure
    .input(
      z.object({
        noteId: z.string(),
        pinned: z.boolean().optional(),
        title: z.string().optional(),
        content: z.string().optional(),
      })
    )
    .mutation(async ({ input: { noteId, pinned, title, content }, ctx }) => {
      const stringifiedContent = JSON.stringify(content);
      const editedNote = await ctx.prisma.note.update({
        where: {
          id: noteId,
        },
        data: {
          pinned: pinned,
          title: title,
          content: stringifiedContent,
        },
      });
      return editedNote;
    }),

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
