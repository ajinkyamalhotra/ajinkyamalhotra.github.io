import { clamp, isReducedMotion } from "./utils.js";

export function initBackgroundCanvas({ canvasId = "bg" } = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return { destroy() {} };

  const ctx = canvas.getContext("2d", { alpha: true });

  const state = {
    w: 0,
    h: 0,
    dpr: 1,
    nodes: [],
    raf: null,
    pointer: { x: 0, y: 0, active: false },
    running: false,
    reduced: isReducedMotion(),
    colors: {
      accent: "rgba(110,231,255,0.55)",
      accent2: "rgba(178,255,110,0.45)",
      fg: "rgba(255,255,255,0.18)",
    },
  };

  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    const a = cs.getPropertyValue("--accent").trim() || "#6ee7ff";
    const a2 = cs.getPropertyValue("--accent2").trim() || "#b2ff6e";
    state.colors.accent = hexToRgba(a, 0.55);
    state.colors.accent2 = hexToRgba(a2, 0.45);
    state.colors.fg = hexToRgba(cs.getPropertyValue("--fg0").trim() || "#ffffff", 0.10);
  }

  function hexToRgba(hex, a) {
    // Handles rgb()/rgba()/hex.
    if (hex.startsWith("rgb")) {
      const nums = hex.match(/\d+/g)?.map(Number) ?? [255, 255, 255];
      return `rgba(${nums[0]},${nums[1]},${nums[2]},${a})`;
    }
    const h = hex.replace("#", "").trim();
    if (h.length === 3) {
      const r = parseInt(h[0] + h[0], 16);
      const g = parseInt(h[1] + h[1], 16);
      const b = parseInt(h[2] + h[2], 16);
      return `rgba(${r},${g},${b},${a})`;
    }
    if (h.length === 6) {
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      return `rgba(${r},${g},${b},${a})`;
    }
    return `rgba(255,255,255,${a})`;
  }

  function resize() {
    state.dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    state.w = Math.floor(window.innerWidth);
    state.h = Math.floor(window.innerHeight);

    canvas.width = Math.floor(state.w * state.dpr);
    canvas.height = Math.floor(state.h * state.dpr);
    canvas.style.width = `${state.w}px`;
    canvas.style.height = `${state.h}px`;

    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

    // Rebuild node field on resize.
    const target = clamp(Math.floor((state.w * state.h) / 26000), 42, 90);
    state.nodes = Array.from({ length: target }, () => makeNode());
  }

  function makeNode() {
    const speed = state.reduced ? 0 : 0.35;
    return {
      x: Math.random() * state.w,
      y: Math.random() * state.h,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      r: 1.2 + Math.random() * 1.6,
    };
  }

  function step() {
    if (!state.running) return;

    ctx.clearRect(0, 0, state.w, state.h);

    // Update + draw nodes
    for (const n of state.nodes) {
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < -20) n.x = state.w + 20;
      if (n.x > state.w + 20) n.x = -20;
      if (n.y < -20) n.y = state.h + 20;
      if (n.y > state.h + 20) n.y = -20;
    }

    // Connections
    const maxD = 140;
    for (let i = 0; i < state.nodes.length; i++) {
      const a = state.nodes[i];
      for (let j = i + 1; j < state.nodes.length; j++) {
        const b = state.nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d > maxD) continue;

        const alpha = (1 - d / maxD) * 0.42;
        ctx.strokeStyle = mix(state.colors.accent, state.colors.accent2, j / state.nodes.length, alpha);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    // Nodes (with pointer glow)
    for (const n of state.nodes) {
      let glow = 0;
      if (state.pointer.active) {
        const d = Math.hypot(n.x - state.pointer.x, n.y - state.pointer.y);
        glow = clamp(1 - d / 180, 0, 1);
      }

      ctx.fillStyle = glow > 0.05 ? mix(state.colors.accent2, state.colors.accent, glow, 0.55) : state.colors.fg;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + glow * 2.4, 0, Math.PI * 2);
      ctx.fill();
    }

    state.raf = requestAnimationFrame(step);
  }

  function renderOnce() {
    ctx.clearRect(0, 0, state.w, state.h);

    // Connections
    const maxD = 140;
    for (let i = 0; i < state.nodes.length; i++) {
      const a = state.nodes[i];
      for (let j = i + 1; j < state.nodes.length; j++) {
        const b = state.nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d > maxD) continue;

        const alpha = (1 - d / maxD) * 0.42;
        ctx.strokeStyle = mix(state.colors.accent, state.colors.accent2, j / state.nodes.length, alpha);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    // Nodes
    for (const n of state.nodes) {
      ctx.fillStyle = state.colors.fg;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function mix(c1, c2, t, alphaOverride = null) {
    // expects rgba(r,g,b,a) strings
    const p1 = c1.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [255, 255, 255, 1];
    const p2 = c2.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [255, 255, 255, 1];
    const r = p1[0] + (p2[0] - p1[0]) * t;
    const g = p1[1] + (p2[1] - p1[1]) * t;
    const b = p1[2] + (p2[2] - p1[2]) * t;
    const a = alphaOverride ?? (p1[3] + (p2[3] - p1[3]) * t);
    return `rgba(${r.toFixed(0)},${g.toFixed(0)},${b.toFixed(0)},${a})`;
  }

  function onPointerMove(e) {
    state.pointer.active = true;
    state.pointer.x = e.clientX;
    state.pointer.y = e.clientY;
  }

  function onPointerLeave() {
    state.pointer.active = false;
  }

  function start() {
    if (state.running) return;
    state.running = true;
    step();
  }

  function stop() {
    state.running = false;
    if (state.raf) cancelAnimationFrame(state.raf);
  }

  // Init
  readColors();
  resize();

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("mousemove", onPointerMove, { passive: true });
  window.addEventListener("mouseleave", onPointerLeave, { passive: true });

  // Theme changes: rely on a custom event.
  window.addEventListener("aj:theme", readColors);

  if (!state.reduced) start();
  else renderOnce();

  return {
    destroy() {
      stop();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("aj:theme", readColors);
    },
  };
}
