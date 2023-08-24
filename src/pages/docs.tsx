import { type NextPage } from "next";
import Head from "next/head";
import Header from "~/components/ui/Header";
import Main from "~/components/ui/layout/Main";

const List: NextPage = () => {
  return (
    <>
      <Head>
        <title>Docs</title>
        <link rel="icon" href="/favicon_dark.svg" />
      </Head>
      <Main>
        <Header text="hotkeys" animate={false} />
        <div className="prose overflow-auto text-text-light marker:text-accent-light prose-headings:text-text-light prose-h1:h-[50px] prose-p:text-text-light prose-a:text-secondary-light  dark:text-text-dark dark:marker:text-accent-dark dark:prose-headings:text-text-dark dark:prose-p:text-text-dark dark:prose-a:text-secondary-dark ">
          <ul>
            <li>global</li>
            <ul>
              <li>
                <span className="rounded-5 bg-foreground-light px-2 py-1 dark:bg-foreground-dark">
                  ctrl+j:
                </span>{" "}
                change theme
              </li>
            </ul>
            <li>note creator</li>
            <ul>
              <li>
                <span className="rounded-5 bg-foreground-light px-2 py-1 dark:bg-foreground-dark">
                  shift+n:
                </span>{" "}
                open note creator
              </li>
              <li>
                <span className="rounded-5 bg-foreground-light px-2 py-1 dark:bg-foreground-dark">
                  escape:
                </span>{" "}
                close note creator
              </li>
            </ul>
            <li>markdown note</li>
            <ul>
              <li>
                <span className="rounded-5 bg-foreground-light px-2 py-1 dark:bg-foreground-dark">
                  ctrl+e:
                </span>{" "}
                render/edit note
              </li>
            </ul>
          </ul>
        </div>
      </Main>
    </>
  );
};

export default List;
