import { useRegisterSW } from "virtual:pwa-register/react";
import { useEffect } from "react";
// import { useTheme } from "../contexts/ThemeProvider";

export function PWAUpdatePrompt() {
  // const { theme } = useTheme();

  const {
    needRefresh: [
      needRefresh,
      // setNeedRefresh
    ],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      console.log("SW Registered: ", r);
    },
    onRegisterError(error: Error) {
      console.log("SW registration error", error);
    },
  });

  // const close = () => {
  //   setNeedRefresh(false);
  // };

  useEffect(() => {
    if (needRefresh) {
      updateServiceWorker(true);
    }
  }, [needRefresh, updateServiceWorker]);

  return null;

  // if (!needRefresh) return null;

  // const isDark =
  //   theme === "dark" ||
  //   (theme === "system" &&
  //     window.matchMedia("(prefers-color-scheme: dark)").matches);

  // return (
  //   <div className="fixed right-4 bottom-4 z-50 max-w-sm">
  //     <div
  //       className={`mx-4 rounded-xl backdrop-blur-sm border shadow-lg transition-all duration-300 ${
  //         isDark
  //           ? "bg-[#121212]/95 border-gray-700/50"
  //           : "bg-white/95 border-gray-200/50"
  //       }`}
  //     >
  //       <div className="p-4">
  //         <div className="flex gap-3 items-start">
  //           <div className="flex-shrink-0">
  //             <div
  //               className={`w-10 h-10 rounded-[10px] flex items-center justify-center transition-all duration-300 ${
  //                 isDark ? "bg-blue-900/30" : "bg-blue-100"
  //               }`}
  //             >
  //               <svg
  //                 className={`w-5 h-5 transition-colors duration-300 ${
  //                   isDark ? "text-blue-400" : "text-blue-600"
  //                 }`}
  //                 fill="none"
  //                 viewBox="0 0 24 24"
  //                 stroke="currentColor"
  //               >
  //                 <path
  //                   strokeLinecap="round"
  //                   strokeLinejoin="round"
  //                   strokeWidth={2}
  //                   d="M13 10V3L4 14h7v7l9-11h-7z"
  //                 />
  //               </svg>
  //             </div>
  //           </div>
  //           <div className="flex-1 min-w-0">
  //             <h3
  //               className={`text-sm font-medium transition-colors duration-300 ${
  //                 isDark ? "text-white" : "text-gray-900"
  //               }`}
  //             >
  //               Update Available
  //             </h3>
  //             <p
  //               className={`mt-1 text-sm transition-colors duration-300 ${
  //                 isDark ? "text-gray-400" : "text-gray-500"
  //               }`}
  //             >
  //               A new version of Bolt.ag is available. Would you like to update
  //               now?
  //             </p>
  //             <div className="flex gap-2 mt-4">
  //               <button
  //                 onClick={() => updateServiceWorker(true)}
  //                 className={`rounded-[10px] py-2 px-3 text-sm font-medium transition-all duration-300 ${
  //                   isDark
  //                     ? "text-white bg-blue-500 hover:bg-blue-600"
  //                     : "text-white bg-blue-600 hover:bg-blue-700"
  //                 }`}
  //               >
  //                 Update
  //               </button>
  //               <button
  //                 onClick={close}
  //                 className={`rounded-[10px] py-2 px-3 text-sm font-medium transition-all duration-300 ${
  //                   isDark
  //                     ? "text-gray-300 bg-gray-800 hover:bg-gray-700"
  //                     : "text-gray-700 bg-gray-100 hover:bg-gray-200"
  //                 }`}
  //               >
  //                 Later
  //               </button>
  //             </div>
  //           </div>
  //           <button
  //             onClick={close}
  //             className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
  //               isDark
  //                 ? "bg-gray-800 hover:bg-gray-700"
  //                 : "bg-gray-100 hover:bg-gray-200"
  //             }`}
  //           >
  //             <svg
  //               className={`w-3 h-3 transition-colors duration-300 ${
  //                 isDark ? "text-gray-400" : "text-gray-500"
  //               }`}
  //               fill="none"
  //               viewBox="0 0 24 24"
  //               stroke="currentColor"
  //             >
  //               <path
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //                 strokeWidth={2}
  //                 d="M6 18L18 6M6 6l12 12"
  //               />
  //             </svg>
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
}
