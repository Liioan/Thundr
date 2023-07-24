import { BeatLoader } from "react-spinners";

interface LoadingScreenProps {
  fullscreen?: boolean;
}

const LoadingScreen = ({ fullscreen = false }: LoadingScreenProps) => {
  return (
    <div
      className={`flex h-screen flex-col items-center justify-center gap-4 ${
        fullscreen ? "h-screen" : "h-40"
      }`}
    >
      <BeatLoader color="#44CBCA" />
      <p>loading</p>
    </div>
  );
};

export default LoadingScreen;
