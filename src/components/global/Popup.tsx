import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import usePopup from "~/hooks/usePopup";
import { useUiStore } from "~/store/useUiStore";

const Popup = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  const onResize = () => {
    setIsDesktop(window.innerWidth >= 1800);
  };

  useEffect(() => {
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  });

  useEffect(() => {
    onResize();
  }, []);

  const { closePopup } = usePopup();
  const { isPopupOpen, popupMessage, isPopupError } = useUiStore();

  useEffect(() => {
    if (isPopupOpen) {
      setTimeout(() => {
        closePopup();
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPopupOpen]);

  return (
    <>
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            className="absolute bottom-[50px] z-50 flex w-full items-center justify-center"
            initial={{ opacity: 0, y: !isDesktop ? 100 : 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: !isDesktop ? 100 : 0 }}
            transition={{ duration: 0.5, ease: "backInOut" }}
          >
            <div
              className={`flex h-16 w-auto max-w-xs items-center justify-center rounded-15  px-6 text-medium font-bold  ${
                isPopupError
                  ? "bg-danger-light text-text-light dark:bg-danger-dark"
                  : "bg-foreground-light text-text-light dark:bg-foreground-dark  dark:text-text-dark"
              } `}
            >
              {popupMessage}
              <span className="text-accent-light dark:text-accent-dark">!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Popup;
