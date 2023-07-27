import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

const GoBackButton = () => {
  const router = useRouter();

  return (
    <button
      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light dark:bg-primary-dark"
      onClick={() => router.back()}
    >
      <ArrowLeftIcon className="w-6 text-text-light dark:text-background-dark" />
    </button>
  );
};

export default GoBackButton;
