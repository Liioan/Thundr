import { type Dispatch, type SetStateAction, useRef } from "react";
import { IoMdCalendar } from "react-icons/io";

interface ReminderDateProps {
  noteReminderDate: string | null;
  setNoteReminderDate: Dispatch<SetStateAction<string | null>>;
}

const ReminderDate = ({
  noteReminderDate,
  setNoteReminderDate,
}: ReminderDateProps) => {
  const today = new Date().toLocaleDateString();
  const dateRef = useRef<HTMLInputElement | null>(null);

  const openDatePicker = () => {
    dateRef.current?.showPicker();
  };

  return noteReminderDate ? (
    <div className="relative flex items-center justify-between rounded-5 bg-foreground-light px-4 py-3 dark:bg-foreground-dark">
      <span
        className={
          today === noteReminderDate
            ? "text-primary-light dark:text-primary-dark"
            : "text-accent-light dark:text-accent-dark"
        }
      >
        {noteReminderDate}
      </span>
      <div>
        <label
          htmlFor="date"
          onClick={openDatePicker}
          className="flex cursor-pointer items-center gap-2 text-text-light dark:text-text-dark"
        >
          change date
          <IoMdCalendar className="text-[25px] text-accent-light dark:text-accent-dark" />
        </label>
        <input
          type="date"
          ref={dateRef}
          className="absolute z-0 w-0 cursor-default self-center opacity-0"
          onChange={(e) =>
            setNoteReminderDate(new Date(e.target.value).toLocaleDateString())
          }
        />
      </div>
    </div>
  ) : (
    <div className=" flex items-center rounded-5 bg-foreground-light px-4 py-3 dark:bg-foreground-dark">
      <label
        htmlFor="date"
        onClick={openDatePicker}
        className="relative z-10 flex cursor-pointer items-center gap-2 text-text-light dark:text-text-dark"
      >
        add reminder date
        <IoMdCalendar className="text-[25px] text-accent-light dark:text-accent-dark" />
      </label>
      <input
        type="date"
        ref={dateRef}
        className="w-0 cursor-default self-start opacity-0"
        onChange={(e) =>
          setNoteReminderDate(new Date(e.target.value).toLocaleDateString())
        }
      />
    </div>
  );
};

export default ReminderDate;
