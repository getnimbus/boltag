import { useEffect, useState } from "react";

export default function HamburgerMenu({
  handleNavigationOpen,
  navigationOpen,
}: {
  handleNavigationOpen: () => void;
  navigationOpen: boolean;
}) {
  const [navigation, setNavigation] = useState<boolean>(false);

  useEffect(() => {
    setNavigation(navigationOpen);
  }, [navigationOpen]);

  return (
    <button
      aria-label="hamburger-toggle-btn"
      className="block md:hidden"
      onClick={() => {
        setNavigation(!navigation);
        handleNavigationOpen();
      }}
    >
      <span className="relative block w-[22px] h-[22px] cursor-pointer">
        <span className="absolute block w-full h-full">
          <span
            className={`block relative top-0 left-0 bg-black rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-[0] ${
              !navigation ? "!w-full delay-300" : ""
            }`}
          />
          <span
            className={`block relative top-0 left-0 bg-black rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-150 ${
              !navigation ? "!w-full delay-400" : ""
            }`}
          />
          <span
            className={`block relative top-0 left-0 bg-black rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-200 ${
              !navigation ? "!w-full delay-500" : ""
            }`}
          />
        </span>

        <span
          className={`block absolute w-full h-full rotate-45 ${
            !navigation ? "hidden" : ""
          }`}
        >
          <span
            className={`block bg-black rounded-sm ease-in-out duration-200 delay-300 absolute left-2.5 top-0 w-0.5 h-full ${
              !navigation ? "h-0 delay-200" : ""
            }`}
          />
          <span
            className={`block bg-black rounded-sm ease-in-out duration-200 delay-400 absolute left-0 top-2.5 w-full h-0.5 ${
              !navigation ? "h-0 delay-200" : ""
            }`}
          />
        </span>
      </span>
    </button>
  );
}
