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
            data = JSON.stringify([{ task: "", isFinished: false }]);
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
        title: z.string().optional(),
        content: z.string().optional(),
      })
    )
    .mutation(async ({ input: { noteId, title, content }, ctx }) => {
      const editedNote = await ctx.prisma.note.update({
        where: {
          id: noteId,
        },
        data: {
          title: title,
          content: content,
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
        select: {
          id: true,
          pin: { where: { userId: currentUserId } },
          title: true,
          type: true,
          content: true,
          reminderDate: true,
          userId: true,
        },
      });
      if (noteData?.userId !== currentUserId) return null;
      return {
        id: noteData.id,
        title: noteData.title,
        content: JSON.parse(noteData.content),
        pinnedByMe: noteData.pin.length > 0,
        reminderDate: noteData.reminderDate,
        type: noteData.type,
      };
    }),

  infinitePinnedNotes: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        noteType: z.string().optional(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(async ({ input: { limit = 10, userId, noteType, cursor }, ctx }) => {
      let whereClause:
        | { userId: string }
        | {
            userId: string;
            noteTypeId: string;
            pin: { some: { userId: string } };
          } = { userId: userId, pin: { some: { userId: userId } } };

      if (noteType) {
        const noteTypeId = await ctx.prisma.noteType.findFirst({
          where: { type: noteType },
          select: { id: true, type: false },
        });
        whereClause = {
          userId: userId,
          noteTypeId: noteTypeId?.id,
          pin: { some: { userId: userId } },
        };
      }

      return await getInfiniteNotes({
        limit,
        ctx,
        cursor,
        whereClause: whereClause,
      });
    }),

  infiniteNotes: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        noteType: z.string().optional(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(async ({ input: { limit = 5, userId, noteType, cursor }, ctx }) => {
      let whereClause:
        | { userId: string }
        | { userId: string; noteTypeId: string } = { userId: userId };

      if (noteType) {
        const noteTypeId = await ctx.prisma.noteType.findFirst({
          where: { type: noteType },
          select: { id: true, type: false },
        });
        whereClause = { userId: userId, noteTypeId: noteTypeId?.id };
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

  togglePin: protectedProcedure
    .input(z.object({ noteId: z.string() }))
    .mutation(async ({ input: { noteId }, ctx }) => {
      const data = { noteId: noteId, userId: ctx.session.user.id };

      const existingPin = await ctx.prisma.pin.findUnique({
        where: { userId_noteId: data },
      });

      if (existingPin == null) {
        await ctx.prisma.pin.create({ data });
        return { addedPin: true };
      } else {
        await ctx.prisma.pin.delete({ where: { userId_noteId: data } });
        return { addedPin: false };
      }
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
  const currentUserId = ctx.session?.user.id;

  const data = await ctx.prisma.note.findMany({
    take: limit + 1,
    cursor: cursor ? { createdAt_id: cursor } : undefined,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    where: whereClause,
    select: {
      id: true,
      content: true,
      pin: currentUserId == null ? false : { where: { userId: currentUserId } },
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
        content: JSON.parse(note.content),
        pinnedByMe: note.pin.length > 0,
        title: note.title,
        type: note.type.type,
        reminderDate: note.reminderDate,
        createdAt: note.createdAt,
      };
    }),
    nextCursor,
  };
}
