import { useRouter } from "next/router";
import { IoIosArrowBack } from "react-icons/io";

const GoBackButton = () => {
  const router = useRouter();

  return (
    <button
      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light dark:bg-primary-dark"
      onClick={() => router.back()}
    >
      <IoIosArrowBack className="-translate-x-[1px] text-2xl text-text-light" />
    </button>
  );
};

export default GoBackButton;
