import Image from "next/image";
import { useState, type SetStateAction, type Dispatch, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "next-themes";
import "@theme-toggles/react/css/Expand.css";
import { Expand } from "@theme-toggles/react";
import { signOut, useSession } from "next-auth/react";
import Overlay from "../ui/Overlay";

interface MenuButtonProps {
  isMenuOpened: boolean;
  setIsMenuOpened: Dispatch<SetStateAction<boolean>>;
}

const MenuButton = ({ isMenuOpened, setIsMenuOpened }: MenuButtonProps) => {
  return (
    <button
      onClick={() => setIsMenuOpened(!isMenuOpened)}
      className="relative flex h-10 w-10 items-center justify-center"
    >
      <AnimatePresence>
        {!isMenuOpened && (
          <motion.span
            className="absolute"
            initial={{ rotate: "180deg", opacity: 0 }}
            animate={{ rotate: "0deg", opacity: 1 }}
            exit={{ rotate: "180deg", opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Bars3Icon className="w-full text-primary-light dark:text-primary-dark" />
          </motion.span>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isMenuOpened && (
          <motion.span
            className="absolute"
            initial={{ rotate: "-180deg", opacity: 0 }}
            animate={{ rotate: "0deg", opacity: 1 }}
            exit={{ rotate: "-180deg", opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <XMarkIcon className="w-full text-primary-light dark:text-primary-dark" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Expand
      duration={500}
      className="self-end text-4xl text-text-light dark:text-text-dark"
      toggled={theme == "light"}
      toggle={() => setTheme(theme === "dark" ? "light" : "dark")}
    />
  );
};

const Nav = () => {
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const onResize = () => {
    setIsMenuOpened(window.innerWidth >= 1800);
  };

  useEffect(() => {
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  });

  useEffect(() => {
    onResize();
  }, []);

  const { data: session } = useSession();

  const { theme } = useTheme();

  let logoUrl = "/logo_dark.svg";
  if (theme === "light") {
    logoUrl = "/logo_light.svg";
  }

  const links = [
    { path: "/", text: "Home" },
    { path: "/notes", text: "Notes" },
    { path: "/Todos", text: "Todo's" },
    { path: "/counters", text: "Counters" },
    { path: "/progressTrackers", text: "Progress trackers" },
    { path: "/decisionTrees", text: "Decision trees" },
    { path: "/sharedFiles", text: "Shared files" },
    { path: "/allFiles", text: "All files" },
  ];

  return (
    <>
      <nav className="fixed top-0 z-30 flex w-full justify-between p-[25px]">
        <MenuButton
          isMenuOpened={isMenuOpened}
          setIsMenuOpened={setIsMenuOpened}
        />
        <Link href={"/"} className="flex items-center justify-center">
          <Image
            src={logoUrl}
            width={100}
            height={30}
            alt="logo"
            priority
            className="h-auto w-auto"
          />
        </Link>
      </nav>
      <Overlay
        condition={isMenuOpened}
        zIndex="z-20"
        className="md:max-w-sm lg:border-r-2 lg:border-foreground-light lg:dark:border-foreground-dark"
      >
        <ThemeSwitch />
        {session != null ? (
          <div className="flex flex-col gap-[50px]">
            <div className="relative flex flex-col gap-[10px] after:absolute after:-bottom-[25px] after:h-[4px] after:w-full after:rounded-full after:bg-accent-light after:content-[''] dark:after:bg-accent-dark">
              {links.map((link) => (
                <Link
                  href={link.path}
                  key={link.path}
                  className="text-big text-text-light dark:text-text-dark"
                >
                  {link.text}
                </Link>
              ))}
            </div>
            <button
              onClick={() => void signOut()}
              className="self-start text-big text-danger-light dark:text-danger-dark"
            >
              Log out
            </button>
          </div>
        ) : (
          <div className="flex h-3/4 items-center justify-center">
            <span className="text-big text-text-light dark:text-text-dark">
              Log in to see more
            </span>
          </div>
        )}
      </Overlay>
    </>
  );
};

export default Nav;
