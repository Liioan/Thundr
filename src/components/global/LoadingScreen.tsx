import { useTheme } from "next-themes";
import { BeatLoader } from "react-spinners";

interface LoadingScreenProps {
  fullscreen?: boolean;
}

const LoadingScreen = ({ fullscreen = false }: LoadingScreenProps) => {
  const { theme } = useTheme();

  return (
    <div
      className={`flex h-screen flex-col items-center justify-center gap-4 ${
        fullscreen
          ? "h-screen bg-background-light dark:bg-background-dark"
          : "h-40"
      }`}
    >
      <BeatLoader color={theme === "dark" ? "#44CBCA" : "#148DA1"} />
      <p>loading</p>
    </div>
  );
};

export default LoadingScreen;
