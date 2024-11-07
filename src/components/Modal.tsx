import { useEffect } from "react";

export const Modal = ({
  children,
  isOpen,
  handleCloseModal,
}: {
  children: any;
  isOpen: boolean;
  handleCloseModal: (value: boolean) => void;
}) => {
  const handleClose = () => {
    handleCloseModal(false);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      handleClose();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Prevent layout flick
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <>
      {isOpen ? (
        <div
          className="flex w-screen h-screen fixed inset-0 overflow-y-auto justify-center items-center bg-[#000000CC] backdrop-filter backdrop-brightness-75 backdrop-blur-sm"
          style={{ zIndex: 1000 }}
          onClick={() => {
            handleClose();
          }}
        >
          <div
            className="relative w-full max-w-4xl xl:min-w-2xl xl:w-max"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="mx-4 rounded-xl"
              style={{
                background: "#fff",
                boxShadow: "0px 0px 40px 0px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                className="absolute text-4xl text-gray-500 cursor-pointer top-2 right-8"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
              >
                &times;
              </div>

              <div className="px-6 pt-9 pb-7">{children}</div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
