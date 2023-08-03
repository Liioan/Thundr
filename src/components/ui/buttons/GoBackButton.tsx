import { useRouter } from "next/router";
import Icon from "../../global/Icon";

const GoBackButton = () => {
  const router = useRouter();

  return (
    <button
      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light dark:bg-primary-dark"
      onClick={() => router.back()}
    >
      <Icon
        iconName="chevron_left"
        className="-translate-x-[1px] text-4xl text-text-light"
      />
    </button>
  );
};

export default GoBackButton;
