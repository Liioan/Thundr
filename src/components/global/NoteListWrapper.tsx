import { type ReactNode } from "react";

interface NoteListWrapperProps {
  children: ReactNode;
}

export const NoteListWrapper = ({ children }: NoteListWrapperProps) => {
  return (
    <section className="flex w-full flex-col gap-[25px] self-center sm:grid sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </section>
  );
};
