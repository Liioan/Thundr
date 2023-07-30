import Image from "next/image";
import { useState, type SetStateAction, type Dispatch, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "next-themes";
import "@theme-toggles/react/css/Expand.css";
import { Expand } from "@theme-toggles/react";
import { signOut, useSession } from "next-auth/react";
import Overlay from "../ui/Overlay";
import Icon from "./Icon";
import NavLink from "../ui/NavLink";
import usePopup from "~/hooks/usePopup";

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
            className="absolute flex items-center justify-center"
            initial={{ rotate: "180deg", opacity: 0 }}
            animate={{ rotate: "0deg", opacity: 1 }}
            exit={{ rotate: "180deg", opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Icon
              iconName="menu"
              className="text-4xl text-primary-light dark:text-primary-dark"
            />
          </motion.span>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isMenuOpened && (
          <motion.span
            className="absolute flex items-center justify-center"
            initial={{ rotate: "-180deg", opacity: 0 }}
            animate={{ rotate: "0deg", opacity: 1 }}
            exit={{ rotate: "-180deg", opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Icon
              iconName="close"
              className="text-4xl text-primary-light dark:text-primary-dark"
            />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();
  const { openPopup } = usePopup();

  return (
    <Expand
      duration={500}
      className="self-end text-4xl text-text-light dark:text-text-dark"
      toggled={theme == "light"}
      toggle={() => {
        setTheme(theme === "dark" ? "light" : "dark");
        openPopup(theme === "dark" ? "Lumos" : "Nox", false);
      }}
    />
  );
};

const links = [
  { path: "/", text: "Home" },
  { path: "/notes", text: "Notes" },
  { path: "/markdownNotes", text: "Markdown Notes" },
  { path: "/todos", text: "Todo's" },
  { path: "/counters", text: "Counters" },
  { path: "/progressTrackers", text: "Progress trackers" },
  { path: "/decisionTrees", text: "Decision trees" },
  { path: "/sharedFiles", text: "Shared files" },
  { path: "/allFiles", text: "All files" },
];

const Nav = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMenuOpened, setIsMenuOpened] = useState(false || isDesktop);

  const onResize = () => {
    setIsDesktop(window.innerWidth >= 1800);
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

  useEffect(() => {
    setIsMenuOpened(isDesktop);
  }, [isDesktop]);

  const { data: session } = useSession();

  const { theme } = useTheme();

  let logoUrl = "/logo_dark.svg";
  if (theme === "light") {
    logoUrl = "/logo_light.svg";
  }

  return (
    <>
      <nav className="fixed top-0 z-40 flex w-full justify-between p-[25px]">
        <MenuButton
          isMenuOpened={isMenuOpened}
          setIsMenuOpened={setIsMenuOpened}
        />
        <Link href={"/"} className="flex items-center justify-center gap-4">
          <AnimatePresence>
            {isMenuOpened && (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ ease: "anticipate", duration: 0.5 }}
              >
                <Image
                  src={logoUrl}
                  width={100}
                  height={30}
                  alt="logo"
                  priority
                  className="h-auto w-auto"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <Icon
            iconName="filter_drama"
            className="bg-gradient-light bg-clip-text text-3xl font-semibold text-transparent dark:bg-gradient-dark"
          />
        </Link>
      </nav>
      <Overlay
        condition={isMenuOpened}
        zIndex="z-30"
        className="md:max-w-sm lg:border-r-2 lg:border-foreground-light lg:dark:border-foreground-dark"
      >
        <ThemeSwitch />
        {session != null ? (
          <div className="flex flex-col gap-[50px]">
            <div className="relative flex flex-col gap-[10px] after:absolute after:-bottom-[25px] after:h-[4px] after:w-full after:rounded-full after:bg-accent-light after:content-[''] dark:after:bg-accent-dark">
              {links.map((link) => (
                <NavLink
                  href={link.path}
                  key={link.path}
                  className="text-big text-text-light dark:text-text-dark"
                  onClickEvent={() => {
                    !isDesktop && setIsMenuOpened(false);
                  }}
                >
                  {link.text}
                </NavLink>
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
        <a
          href="https://github.com/Liioan/Thundr"
          className="absolute bottom-[25px] left-[25px]"
        >
          <Image
            src={"/github.svg"}
            width={30}
            height={30}
            alt="github logo"
            className="h-7 w-7 opacity-50 dark:invert"
          />
        </a>
      </Overlay>
    </>
  );
};

export default Nav;
