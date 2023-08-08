import Image from "next/image";

interface NoNotesScreenProps {
  noteType: string;
}

const NoNotesScreen = ({ noteType }: NoNotesScreenProps) => {
  return (
    <div className="flex min-h-[500px] w-full flex-col items-center justify-center gap-7">
      <h1 className="text-center text-3xl font-bold text-text-light opacity-50 dark:text-text-dark">
        No {noteType}s!
      </h1>
      <Image
        alt="no notes"
        width={170}
        height={250}
        src={"/no_notes_img.webp"}
        className="max-h-[250px] w-2/3 max-w-[170px] opacity-50 invert dark:invert-0"
      />
    </div>
  );
};

export default NoNotesScreen;
