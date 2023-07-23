import {
  type GetStaticPropsContext,
  type InferGetStaticPropsType,
  type NextPage,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import GoBackButton from "~/components/global/GoBackButton";
import Title from "~/components/ui/Title";
import { api } from "~/utils/api";

const NotePage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const note = api.note.getNoteDetails.useQuery({ noteId: id as string });

  return (
    <>
      <Head>
        <title>{`Note - ${note.data?.title}`}</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main className="flex h-screen flex-col gap-[25px] bg-background-light px-[25px] pt-24 transition-colors duration-200 dark:bg-background-dark">
        <GoBackButton />
        <Title text={note.data?.title ?? ""} />
        <p className="text-small text-text-light dark:text-text-dark">
          {note.data?.content}
        </p>
      </main>
    </>
  );
};

export default NotePage;
