import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Main from "~/components/ui/layout/Main";

const List: NextPage = () => {
  return (
    <>
      <Head>
        <title>Shared files</title>
        <link rel="icon" href="/favicon_dark.svg" />
      </Head>
      <Main className="flex items-center justify-center gap-10">
        <h1 className="text-4xl">
          coming soon
          <span className="text-accent-light dark:text-accent-dark">!</span>
        </h1>
        <Link
          href={"/"}
          className="rounded-full bg-primary-light px-4 py-2 text-text-light dark:bg-primary-dark"
        >
          go back to home page
        </Link>
      </Main>
    </>
  );
};

export default List;
