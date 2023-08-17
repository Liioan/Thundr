import { type ReactNode } from "react";

interface ResponsiveWrapperProps {
  children: ReactNode;
  className?: string;
}

export const ResponsiveWrapper = ({
  className = "",
  children,
}: ResponsiveWrapperProps) => {
  return (
    <section
      className={`flex h-auto flex-col gap-[25px] md:w-3/4 md:self-center 2xl:w-[1024px] ${className}`}
    >
      {children}
    </section>
  );
};
