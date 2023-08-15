import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ThemeProvider } from "next-themes";
import Nav from "~/components/global/Nav";
import NoteCreator from "~/components/global/NoteCreator";
import Popup from "~/components/global/Popup";
import { useHotkeys } from "@mantine/hooks";
import { useUiStore } from "~/store/useUiStore";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { setIsNoteCreatorOpen } = useUiStore();
  useHotkeys([["shift+n", () => setIsNoteCreatorOpen(true)]]);

  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <Nav />
        <NoteCreator />
        <Popup />
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
