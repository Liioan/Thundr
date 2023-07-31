import { z } from "zod";
import {
  type createTRPCContext,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import type { Prisma } from "@prisma/client";
import { type inferAsyncReturnType } from "@trpc/server";

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
          //. this needs to create different json, for each note type
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

        return { ...newNote, noteType };
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

  infiniteNotesOfType: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        pinned: z.boolean(),
        noteType: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(
      async ({
        input: { limit = 10, userId, noteType, pinned, cursor },
        ctx,
      }) => {
        const noteTypeId = await ctx.prisma.noteType.findFirst({
          where: {
            type: noteType,
          },
          select: {
            id: true,
          },
        });

        let whereClause:
          | { userId: string; noteTypeId: string }
          | { userId: string; noteTypeId: string; pinned: boolean } = {
          userId: userId,
          noteTypeId: noteTypeId?.id ?? "",
        };
        if (pinned) {
          whereClause = {
            userId: userId,
            noteTypeId: noteTypeId?.id ?? "",
            pinned: pinned,
          };
        }

        return await getInfiniteNotes({
          limit,
          ctx,
          cursor,
          whereClause: whereClause,
        });
      }
    ),

  infiniteNotes: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        pinned: z.boolean(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(async ({ input: { limit = 10, userId, pinned, cursor }, ctx }) => {
      let whereClause:
        | { userId: string }
        | { userId: string; pinned: boolean } = { userId: userId };
      if (pinned) {
        whereClause = { userId: userId, pinned: pinned };
      }

      return await getInfiniteNotes({
        limit,
        ctx,
        cursor,
        whereClause: whereClause,
      });
    }),

  deleteNote: protectedProcedure
    .input(z.object({ noteId: z.string() }))
    .mutation(async ({ input: { noteId }, ctx }) => {
      await ctx.prisma.note.delete({
        where: {
          id: noteId,
        },
      });
      return "Note deleted";
    }),
});

async function getInfiniteNotes({
  whereClause,
  ctx,
  limit,
  cursor,
}: {
  whereClause?: Prisma.NoteWhereInput;
  limit: number;
  cursor: { id: string; createdAt: Date } | undefined;
  ctx: inferAsyncReturnType<typeof createTRPCContext>;
}) {
  const data = await ctx.prisma.note.findMany({
    take: limit + 1,
    cursor: cursor ? { createdAt_id: cursor } : undefined,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    where: whereClause,
    select: {
      id: true,
      content: true,
      pinned: true,
      title: true,
      type: true,
      reminderDate: true,
      createdAt: true,
    },
  });

  let nextCursor: typeof cursor | undefined;
  if (data.length > limit) {
    const nextItem = data.pop();
    if (nextItem != null) {
      nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
    }
  }

  return {
    notes: data.map((note) => {
      return {
        id: note.id,
        content: note.content,
        pinned: note.pinned,
        title: note.title,
        type: note.type.type,
        reminderDate: note.reminderDate,
        createdAt: note.createdAt,
      };
    }),
    nextCursor,
  };
}
