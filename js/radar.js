import { clamp, isReducedMotion } from "./utils.js";

export function initSkillsRadar({
  canvasId = "skillsRadar",
  hintId = "skillsRadarHint",
  skills = [],
} = {}) {
  const canvas = document.getElementById(canvasId);
  const hint = document.getElementById(hintId);
  if (!canvas) return { destroy() {} };

  const ctx = canvas.getContext("2d");
  const state = {
    w: canvas.width,
    h: canvas.height,
    dpr: Math.max(1, Math.min(2, window.devicePixelRatio || 1)),
    hoverIdx: -1,
    pinnedIdx: -1,
    reduced: isReducedMotion(),
    colors: {
      fg: "rgba(255,255,255,0.75)",
      grid: "rgba(255,255,255,0.10)",
      accent: "rgba(110,231,255,0.55)",
      accent2: "rgba(178,255,110,0.35)",
      node: "rgba(255,255,255,0.85)",
    },
  };

  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    const fg = cs.getPropertyValue("--fg0").trim() || "#ffffff";
    const grid = cs.getPropertyValue("--border").trim() || "rgba(255,255,255,0.12)";
    const a = cs.getPropertyValue("--accent").trim() || "#6ee7ff";
    const a2 = cs.getPropertyValue("--accent2").trim() || "#b2ff6e";

    state.colors.fg = toRgba(fg, 0.74);
    state.colors.grid = toRgba(grid.startsWith("rgba") ? grid : fg, 0.12);
    state.colors.accent = toRgba(a, 0.55);
    state.colors.accent2 = toRgba(a2, 0.30);
    state.colors.node = toRgba(fg, 0.90);
  }

  function toRgba(color, a) {
    if (color.startsWith("rgba")) {
      const nums = color.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [255, 255, 255, 1];
      return `rgba(${nums[0]},${nums[1]},${nums[2]},${a})`;
    }
    if (color.startsWith("rgb")) {
      const nums = color.match(/\d+/g)?.map(Number) ?? [255, 255, 255];
      return `rgba(${nums[0]},${nums[1]},${nums[2]},${a})`;
    }
    const h = color.replace("#", "");
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

  function fitText(ctx, text, maxWidth) {
    const s = String(text ?? "");
    if (ctx.measureText(s).width <= maxWidth) return s;

    const ell = "…";
    if (ctx.measureText(ell).width > maxWidth) return ell;

    // Binary search the largest prefix that fits.
    let lo = 0;
    let hi = s.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi + 1) / 2);
      const candidate = s.slice(0, mid).trimEnd() + ell;
      if (ctx.measureText(candidate).width <= maxWidth) lo = mid;
      else hi = mid - 1;
    }
    return s.slice(0, lo).trimEnd() + ell;
  }

  function resize() {
    // Keep backing store crisp.
    const rect = canvas.getBoundingClientRect();
    const cssW = rect.width || state.w;
    const cssH = rect.height || state.h;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    state.w = cssW;
    state.h = cssH;
    state.dpr = dpr;

    draw();
  }

  function draw() {
    const W = state.w;
    const H = state.h;

    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2;
    const r = Math.min(W, H) * 0.34;

    const n = skills.length;
    if (n === 0) return;

    // Grid rings
    const rings = 5;
    ctx.strokeStyle = state.colors.grid;
    ctx.lineWidth = 1;

    for (let i = 1; i <= rings; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, (r * i) / rings, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Axes + labels
    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const ax = cx + Math.cos(angle) * r;
      const ay = cy + Math.sin(angle) * r;

      ctx.strokeStyle = state.colors.grid;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(ax, ay);
      ctx.stroke();

      const rawLabel = skills[i].name;
      const mono = getComputedStyle(document.documentElement).getPropertyValue("--mono") || "monospace";
      ctx.font = `12px ${mono}`;
      ctx.fillStyle = state.colors.fg;
      const alignRight = angle > Math.PI / 2 || angle < -Math.PI / 2;
      ctx.textAlign = alignRight ? "right" : "left";
      ctx.textBaseline = "middle";

      // Keep labels inside the canvas bounds (avoid clipping on small screens).
      const pad = 12;
      const maxText = Math.max(40, W - pad * 2);
      const label = fitText(ctx, rawLabel, maxText);
      const tw = ctx.measureText(label).width;

      let lx = cx + Math.cos(angle) * (r + 18);
      let ly = cy + Math.sin(angle) * (r + 18);

      // Clamp within bounds based on alignment.
      if (alignRight) {
        lx = clamp(lx, pad + tw, W - pad);
      } else {
        lx = clamp(lx, pad, W - pad - tw);
      }
      ly = clamp(ly, pad, H - pad);

      ctx.fillText(label, lx, ly);
    }

    // Polygon
    const points = skills.map((s, i) => {
      const val = clamp((s.level || 0) / 10, 0, 1);
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      return {
        x: cx + Math.cos(angle) * r * val,
        y: cy + Math.sin(angle) * r * val,
      };
    });

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
    ctx.closePath();

    ctx.fillStyle = state.colors.accent2;
    ctx.fill();

    ctx.strokeStyle = state.colors.accent;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Nodes
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const isHot = i === (state.pinnedIdx >= 0 ? state.pinnedIdx : state.hoverIdx);
      ctx.fillStyle = isHot ? state.colors.accent : state.colors.node;
      ctx.beginPath();
      ctx.arc(p.x, p.y, isHot ? 5.2 : 4.1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Keep hint in sync
    const idx = state.pinnedIdx >= 0 ? state.pinnedIdx : state.hoverIdx;
    if (hint) {
      if (idx < 0) {
        hint.textContent = "Hover nodes · Click a category to pin";
      } else {
        const s = skills[idx];
        const top = (s.subSkills || []).slice(0, 4).map((x) => x.name).join(", ");
        hint.textContent = `${s.name}: ${s.level}/10 · ${top}`;
      }
    }

    // Store points for interaction
    state._points = points;
    state._center = { cx, cy, r };
  }

  function hitTest(x, y) {
    const pts = state._points || [];
    let best = -1;
    let bestD = Infinity;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const d = Math.hypot(x - p.x, y - p.y);
      if (d < 14 && d < bestD) {
        bestD = d;
        best = i;
      }
    }
    return best;
  }

  function onMove(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const idx = hitTest(x, y);
    if (idx !== state.hoverIdx) {
      state.hoverIdx = idx;
      draw();
    }
  }

  function onLeave() {
    if (state.hoverIdx !== -1) {
      state.hoverIdx = -1;
      draw();
    }
  }

  function onClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const idx = hitTest(x, y);
    if (idx < 0) return;
    state.pinnedIdx = state.pinnedIdx === idx ? -1 : idx;
    draw();
  }

  readColors();
  resize();

  canvas.addEventListener("mousemove", onMove, { passive: true });
  canvas.addEventListener("mouseleave", onLeave, { passive: true });
  canvas.addEventListener("click", onClick);
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("aj:theme", () => {
    readColors();
    draw();
  });

  // In reduced motion, just draw once.
  if (state.reduced) draw();

  return {
    destroy() {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("resize", resize);
    },
  };
}
