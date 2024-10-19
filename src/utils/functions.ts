import confetti from "canvas-confetti";
import { toastMsg, isSuccessToast, showToast, bonusScore, openScreenBonusScore } from "~/store";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { wait } from "./index";

export const triggerBonusScore = async (score: number, delay: number) => {
  openScreenBonusScore.update((n) => n = true);
  bonusScore.update((n) => n = score);
  triggerFirework();
  await wait(delay);
  openScreenBonusScore.update((n) => n = false);
  bonusScore.update((n) => n = 0);
};

let counterToast = 5;

const trigger = () => {
  showToast.update((n) => n = true)
  counterToast = 5;
  timeout();
};

const timeout = () => {
  if (--counterToast > 0) return setTimeout(timeout, 1000);
  showToast.update((n) => n = false)
  toastMsg.update((n) => n = "")
  isSuccessToast.update((n) => n = false)
};

export const triggerToast = (msg: string, status: "success" | "fail") => {
  toastMsg.update((n) => n = msg)
  isSuccessToast.update((n) => n = (status === "success" ? true : false))
  trigger();
};

export const triggerClickOutside = (node) => {
  const handleClick = (event) => {
    if (node && !node.contains(event.target) && !event.defaultPrevented) {
      node.dispatchEvent(new CustomEvent("click_outside", node));
    }
  };

  document.addEventListener("click", handleClick, true);

  return {
    destroy() {
      document.removeEventListener("click", handleClick, true);
    },
  };
};

const fire = (particleRatio, opts) => {
  confetti({
    ...opts,
    origin: { y: 0.7 },
    zIndex: 2147483649,
    particleCount: Math.floor(200 * particleRatio),
  });
};

export const triggerFirework = () => {
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

export const triggerDrivePortfolio: any = (steps: any) =>
  driver({
    showProgress: true,
    overlayColor: "#27326f",
    showButtons: ["next", "previous", "close"],
    steps,
  });
