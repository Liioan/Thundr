import Main from "~/components/ui/Main";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { motion } from "framer-motion";

const Custom404 = () => {
  return (
    <>
      <Head>
        <title>Thundr - page not found</title>
        <meta name="description" content="Note app" />
        <link rel="icon" href="/favicon_dark.svg" />
      </Head>
      <Main className="flex flex-col items-center justify-center bg-background-dark">
        <motion.div
          className="flex w-full max-w-[450px] flex-col items-center justify-center  gap-[40px] rounded-15 bg-foreground-dark p-10"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "backInOut" }}
        >
          <div className="flex flex-col gap-[10px]">
            <h1 className="text-center text-3xl font-bold text-accent-dark sm:text-5xl">
              404
            </h1>
            <h2 className="text-center text-xl font-bold text-text-dark sm:text-3xl">
              Page not found
            </h2>
          </div>
          <motion.div
            className="flex w-full justify-center"
            animate={{
              y: [5, -5, 5],
            }}
            transition={{
              duration: 5,
              ease: "backInOut",
              repeat: Infinity,
            }}
          >
            <Image
              src={"/404_img.webp"}
              width={170}
              height={250}
              alt="404 image"
              className="max-h-[250px] w-2/3 max-w-[170px]"
            />
          </motion.div>
          <Link
            href={"/"}
            className="rounded-full bg-primary-dark px-5 py-3 text-center text-small font-bold text-text-light sm:text-medium"
          >
            Go back to home page
          </Link>
        </motion.div>
      </Main>
    </>
  );
};

export default Custom404;
