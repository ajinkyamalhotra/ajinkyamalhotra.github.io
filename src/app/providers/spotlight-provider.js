import { isCoarsePointer, isReducedMotionPreferred } from "@shared/utils/platform.js";

export function createSpotlightProvider() {
  return {
    init() {
      const root = document.documentElement;
      if (!root) {
        return;
      }

      if (isCoarsePointer() || isReducedMotionPreferred()) {
        root.classList.remove("spotlight-on");
        return;
      }

      root.classList.add("spotlight-on");

      let x = window.innerWidth * 0.5;
      let y = window.innerHeight * 0.3;
      let frame;

      const sync = () => {
        frame = undefined;
        root.style.setProperty("--spot-x", `${x}px`);
        root.style.setProperty("--spot-y", `${y}px`);
      };

      const scheduleSync = () => {
        if (frame) {
          return;
        }

        frame = window.requestAnimationFrame(sync);
      };

      window.addEventListener(
        "mousemove",
        (event) => {
          x = event.clientX;
          y = event.clientY;
          scheduleSync();
        },
        { passive: true },
      );

      window.addEventListener("mouseleave", () => {
        x = window.innerWidth * 0.5;
        y = window.innerHeight * 0.3;
        scheduleSync();
      });

      sync();
    },
  };
}
