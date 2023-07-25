import { type ReactNode } from "react";

interface NoteListWrapperProps {
  children: ReactNode;
}

export const NoteListWrapper = ({ children }: NoteListWrapperProps) => {
  return (
    <section className="flex flex-col items-center gap-[25px] sm:grid sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </section>
  );
};
