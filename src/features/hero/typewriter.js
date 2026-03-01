export function createTypewriter({ host, lines }) {
  if (!host || !Array.isArray(lines) || lines.length === 0) {
    return { start() {}, stop() {} };
  }

  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (reducedMotion) {
    host.textContent = lines[0];
    return { start() {}, stop() {} };
  }

  let lineIndex = 0;
  let characterIndex = 0;
  let direction = "typing";
  let timer;

  const schedule = (fn, delay) => {
    timer = window.setTimeout(fn, delay);
  };

  const tick = () => {
    const current = lines[lineIndex];

    if (direction === "typing") {
      characterIndex += 1;
      host.textContent = current.slice(0, characterIndex);

      if (characterIndex >= current.length) {
        direction = "deleting";
        schedule(tick, 850);
        return;
      }

      schedule(tick, 28);
      return;
    }

    characterIndex -= 1;
    host.textContent = current.slice(0, Math.max(0, characterIndex));

    if (characterIndex <= 0) {
      direction = "typing";
      lineIndex = (lineIndex + 1) % lines.length;
      schedule(tick, 220);
      return;
    }

    schedule(tick, 18);
  };

  return {
    start() {
      tick();
    },
    stop() {
      window.clearTimeout(timer);
    },
  };
}
