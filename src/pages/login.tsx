import { type GetServerSideProps, type NextPage } from "next";
import { signIn } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { getServerAuthSession } from "~/server/auth";
import { useEffect } from "react";

const Login: NextPage = () => {
  const { theme } = useTheme();

  let logoUrl = "/Logo_with_icon_dark.png";
  if (theme === "light") {
    logoUrl = "/Logo_with_icon_light.png";
  }

  return (
    <main className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark">
      <div className="flex w-mobile flex-col items-center gap-10 rounded-15 bg-foreground-light py-10 dark:bg-foreground-dark">
        <Image src={logoUrl} width={150} height={78} alt="logo" />
        <p className="text-center text-big">Note app</p>
        <button
          className="rounded-5 bg-primary-light px-4 py-2 font-bold text-text-light dark:bg-primary-dark dark:text-background-dark"
          onClick={() => void signIn("discord")}
        >
          Sign in with discord
        </button>
      </div>
    </main>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
