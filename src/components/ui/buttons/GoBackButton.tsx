import { useRouter } from "next/router";
import { IoIosArrowBack } from "react-icons/io";

const GoBackButton = () => {
  const router = useRouter();

  return (
    <button
      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light transition-colors duration-200 hover:bg-accept-light dark:bg-primary-dark dark:hover:bg-accept-dark"
      onClick={() => router.back()}
    >
      <IoIosArrowBack className="-translate-x-[1px] text-2xl text-text-light" />
    </button>
  );
};

export default GoBackButton;
