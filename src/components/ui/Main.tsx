import { type ReactNode } from "react";

interface MainProps {
  children: ReactNode;
  className?: string;
}

const Main = ({ children, className = "" }: MainProps) => {
  return (
    <main
      className={`flex min-h-screen flex-col bg-background-light px-[25px] pb-16 pt-24 transition-colors duration-200 dark:bg-background-dark ${className}`}
    >
      {children}
    </main>
  );
};

export default Main;
