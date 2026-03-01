import { APP_EVENTS } from "@shared/constants/events.js";
import { clamp } from "@shared/utils/math.js";
import { isReducedMotionPreferred } from "@shared/utils/platform.js";

function toRgba(color, alpha) {
  if (color.startsWith("rgb")) {
    const values = color.match(/\d+/g)?.map(Number) ?? [255, 255, 255];
    return `rgba(${values[0]},${values[1]},${values[2]},${alpha})`;
  }

  const hex = color.replace("#", "").trim();
  if (hex.length === 3) {
    const r = parseInt(`${hex[0]}${hex[0]}`, 16);
    const g = parseInt(`${hex[1]}${hex[1]}`, 16);
    const b = parseInt(`${hex[2]}${hex[2]}`, 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  if (hex.length === 6) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  return `rgba(255,255,255,${alpha})`;
}

function blend(rgba1, rgba2, ratio, alphaOverride = null) {
  const left = rgba1.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [255, 255, 255, 1];
  const right = rgba2.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [255, 255, 255, 1];

  const r = left[0] + (right[0] - left[0]) * ratio;
  const g = left[1] + (right[1] - left[1]) * ratio;
  const b = left[2] + (right[2] - left[2]) * ratio;
  const a = alphaOverride ?? left[3] + (right[3] - left[3]) * ratio;

  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;
}

export function createBackgroundFeature({ canvasId = "bg" } = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    return { init() {} };
  }

  const context = canvas.getContext("2d", { alpha: true });

  const state = {
    width: 0,
    height: 0,
    dpr: 1,
    nodes: [],
    frame: undefined,
    pointer: {
      x: 0,
      y: 0,
      active: false,
    },
    running: false,
    reduced: isReducedMotionPreferred(),
    colors: {
      accent: "rgba(110,231,255,0.55)",
      accentAlt: "rgba(178,255,110,0.45)",
      foreground: "rgba(255,255,255,0.15)",
    },
  };

  function readColors() {
    const style = getComputedStyle(document.documentElement);
    const accent = style.getPropertyValue("--color-accent").trim() || "#6ee7ff";
    const accentAlt = style.getPropertyValue("--color-accent-alt").trim() || "#b2ff6e";
    const foreground = style.getPropertyValue("--color-fg-0").trim() || "#ffffff";

    state.colors.accent = toRgba(accent, 0.55);
    state.colors.accentAlt = toRgba(accentAlt, 0.45);
    state.colors.foreground = toRgba(foreground, 0.1);
  }

  function createNode() {
    const speed = state.reduced ? 0 : 0.35;
    return {
      x: Math.random() * state.width,
      y: Math.random() * state.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      radius: 1.2 + Math.random() * 1.6,
    };
  }

  function resize() {
    state.dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    state.width = Math.floor(window.innerWidth);
    state.height = Math.floor(window.innerHeight);

    canvas.width = Math.floor(state.width * state.dpr);
    canvas.height = Math.floor(state.height * state.dpr);
    canvas.style.width = `${state.width}px`;
    canvas.style.height = `${state.height}px`;

    context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

    const amount = clamp(Math.floor((state.width * state.height) / 26000), 42, 90);
    state.nodes = Array.from({ length: amount }, () => createNode());
  }

  function advanceNodes() {
    state.nodes.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < -20) node.x = state.width + 20;
      if (node.x > state.width + 20) node.x = -20;
      if (node.y < -20) node.y = state.height + 20;
      if (node.y > state.height + 20) node.y = -20;
    });
  }

  function drawConnections() {
    const maxDistance = 140;

    for (let left = 0; left < state.nodes.length; left += 1) {
      const source = state.nodes[left];

      for (let right = left + 1; right < state.nodes.length; right += 1) {
        const target = state.nodes[right];
        const distance = Math.hypot(source.x - target.x, source.y - target.y);

        if (distance > maxDistance) {
          continue;
        }

        const alpha = (1 - distance / maxDistance) * 0.42;
        context.strokeStyle = blend(
          state.colors.accent,
          state.colors.accentAlt,
          right / state.nodes.length,
          alpha,
        );
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(source.x, source.y);
        context.lineTo(target.x, target.y);
        context.stroke();
      }
    }
  }

  function drawNodes() {
    state.nodes.forEach((node) => {
      let glow = 0;
      if (state.pointer.active) {
        const distance = Math.hypot(node.x - state.pointer.x, node.y - state.pointer.y);
        glow = clamp(1 - distance / 180, 0, 1);
      }

      context.fillStyle =
        glow > 0.05
          ? blend(state.colors.accentAlt, state.colors.accent, glow, 0.55)
          : state.colors.foreground;

      context.beginPath();
      context.arc(node.x, node.y, node.radius + glow * 2.4, 0, Math.PI * 2);
      context.fill();
    });
  }

  function renderFrame() {
    if (!state.running) {
      return;
    }

    context.clearRect(0, 0, state.width, state.height);
    advanceNodes();
    drawConnections();
    drawNodes();

    state.frame = window.requestAnimationFrame(renderFrame);
  }

  function renderStatic() {
    context.clearRect(0, 0, state.width, state.height);
    drawConnections();
    drawNodes();
  }

  function onMouseMove(event) {
    state.pointer.active = true;
    state.pointer.x = event.clientX;
    state.pointer.y = event.clientY;
  }

  function onMouseLeave() {
    state.pointer.active = false;
  }

  function init() {
    readColors();
    resize();

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave, { passive: true });
    window.addEventListener(APP_EVENTS.themeChanged, readColors);

    if (state.reduced) {
      renderStatic();
      return;
    }

    state.running = true;
    renderFrame();
  }

  return { init };
}
