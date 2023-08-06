import Main from "~/components/ui/Main";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

const Custom404 = () => {
  return (
    <>
      <Head>
        <title>Thundr - page not found</title>
        <meta name="description" content="Note app" />
        <link rel="icon" href="/favicon_dark.svg" />
      </Head>
      <Main className="flex flex-col items-center justify-center">
        <div className="flex w-full max-w-[450px] flex-col items-center justify-center  gap-[40px] rounded-15 bg-foreground-dark p-10">
          <div className="flex flex-col gap-[10px]">
            <h1 className="text-center text-3xl text-text-dark sm:text-5xl">
              404
            </h1>
            <h2 className="text-center text-xl text-text-dark sm:text-3xl">
              Page not found
            </h2>
          </div>
          <Image
            src={"/404_img.webp"}
            width={170}
            height={250}
            alt="404 image"
            className="max-h-[250px] w-2/3 max-w-[170px]"
          />
          <Link
            href={"/"}
            className="rounded-full bg-primary-dark px-5 py-3 text-center text-small font-bold text-text-light sm:text-medium"
          >
            Go back to home page
          </Link>
        </div>
      </Main>
    </>
  );
};

export default Custom404;
