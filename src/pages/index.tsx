import Head from "next/head";
import { type GetServerSideProps, type NextPage } from "next";
import { getServerAuthSession } from "../server/auth";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Thundr</title>
        <meta name="description" content="Note app" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main className="h-[10000px] bg-background-light px-[25px] pt-24 transition-colors duration-200 dark:bg-background-dark">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Harum,
        architecto voluptatum consectetur illum soluta totam maxime explicabo?
        Ex sequi ullam eum cupiditate, impedit quam odio, officia, accusamus
        dolore magnam dolorum?
      </main>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
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
