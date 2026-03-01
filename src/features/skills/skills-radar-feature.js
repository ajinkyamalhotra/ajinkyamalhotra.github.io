import { APP_EVENTS } from "@shared/constants/events.js";
import { clamp } from "@shared/utils/math.js";

function toRgba(color, alpha) {
  if (color.startsWith("rgba")) {
    const values = color.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [255, 255, 255, 1];
    return `rgba(${values[0]},${values[1]},${values[2]},${alpha})`;
  }

  if (color.startsWith("rgb")) {
    const values = color.match(/\d+/g)?.map(Number) ?? [255, 255, 255];
    return `rgba(${values[0]},${values[1]},${values[2]},${alpha})`;
  }

  const hex = color.replace("#", "");
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

function ellipsisFit(context, text, maxWidth) {
  if (context.measureText(text).width <= maxWidth) {
    return text;
  }

  const marker = "...";
  if (context.measureText(marker).width > maxWidth) {
    return marker;
  }

  let min = 0;
  let max = text.length;

  while (min < max) {
    const pivot = Math.floor((min + max + 1) / 2);
    const candidate = `${text.slice(0, pivot).trimEnd()}${marker}`;
    if (context.measureText(candidate).width <= maxWidth) {
      min = pivot;
    } else {
      max = pivot - 1;
    }
  }

  return `${text.slice(0, min).trimEnd()}${marker}`;
}

export function createSkillsRadarFeature({ skills }) {
  const canvas = document.getElementById("skillsRadar");
  const hint = document.getElementById("skillsRadarHint");

  if (!canvas) {
    return { init() {} };
  }

  const context = canvas.getContext("2d");
  const state = {
    width: canvas.width,
    height: canvas.height,
    hoverIndex: -1,
    pinIndex: -1,
    points: [],
    colors: {
      fg: "rgba(255,255,255,0.75)",
      grid: "rgba(255,255,255,0.12)",
      accent: "rgba(110,231,255,0.58)",
      accent2: "rgba(178,255,110,0.35)",
      node: "rgba(255,255,255,0.9)",
    },
  };

  function readPalette() {
    const style = getComputedStyle(document.documentElement);
    const fg = style.getPropertyValue("--color-fg-0").trim() || "#ffffff";
    const border = style.getPropertyValue("--color-border").trim() || "#ffffff";
    const accent = style.getPropertyValue("--color-accent").trim() || "#6ee7ff";
    const accent2 = style.getPropertyValue("--color-accent-alt").trim() || "#b2ff6e";

    state.colors.fg = toRgba(fg, 0.74);
    state.colors.grid = toRgba(border, 0.2);
    state.colors.accent = toRgba(accent, 0.58);
    state.colors.accent2 = toRgba(accent2, 0.35);
    state.colors.node = toRgba(fg, 0.9);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || state.width;
    const height = rect.height || state.height;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    state.width = width;
    state.height = height;

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function drawLabel(name, x, y, angle, width, height) {
    const padding = 12;
    const alignRight = angle > Math.PI / 2 || angle < -Math.PI / 2;

    context.font = `12px var(--font-mono)`;
    context.fillStyle = state.colors.fg;
    context.textAlign = alignRight ? "right" : "left";
    context.textBaseline = "middle";

    const maxWidth = Math.max(40, width - padding * 2);
    const text = ellipsisFit(context, name, maxWidth);
    const textWidth = context.measureText(text).width;

    let dx = x;
    let dy = y;

    if (alignRight) {
      dx = clamp(dx, padding + textWidth, width - padding);
    } else {
      dx = clamp(dx, padding, width - padding - textWidth);
    }

    dy = clamp(dy, padding, height - padding);
    context.fillText(text, dx, dy);
  }

  function draw() {
    const width = state.width;
    const height = state.height;

    context.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.34;

    if (!skills.length) {
      return;
    }

    const ringCount = 5;
    context.strokeStyle = state.colors.grid;
    context.lineWidth = 1;

    for (let ring = 1; ring <= ringCount; ring += 1) {
      context.beginPath();
      context.arc(centerX, centerY, (radius * ring) / ringCount, 0, Math.PI * 2);
      context.stroke();
    }

    const points = skills.map((skill, index) => {
      const angle = (Math.PI * 2 * index) / skills.length - Math.PI / 2;
      const valueRadius = radius * clamp(skill.level / 10, 0, 1);
      const point = {
        x: centerX + Math.cos(angle) * valueRadius,
        y: centerY + Math.sin(angle) * valueRadius,
      };

      const axisX = centerX + Math.cos(angle) * radius;
      const axisY = centerY + Math.sin(angle) * radius;

      context.strokeStyle = state.colors.grid;
      context.beginPath();
      context.moveTo(centerX, centerY);
      context.lineTo(axisX, axisY);
      context.stroke();

      drawLabel(
        skill.name,
        centerX + Math.cos(angle) * (radius + 18),
        centerY + Math.sin(angle) * (radius + 18),
        angle,
        width,
        height,
      );

      return point;
    });

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach((point) => {
      context.lineTo(point.x, point.y);
    });
    context.closePath();

    context.fillStyle = state.colors.accent2;
    context.fill();

    context.strokeStyle = state.colors.accent;
    context.lineWidth = 2;
    context.stroke();

    points.forEach((point, index) => {
      const activeIndex = state.pinIndex >= 0 ? state.pinIndex : state.hoverIndex;
      const isActive = activeIndex === index;
      context.fillStyle = isActive ? state.colors.accent : state.colors.node;
      context.beginPath();
      context.arc(point.x, point.y, isActive ? 5.2 : 4.1, 0, Math.PI * 2);
      context.fill();
    });

    state.points = points;

    const detailIndex = state.pinIndex >= 0 ? state.pinIndex : state.hoverIndex;
    if (hint) {
      if (detailIndex < 0) {
        hint.textContent = "Hover nodes  |  Click a category to pin";
      } else {
        const selected = skills[detailIndex];
        const subSkills = selected.subSkills
          .slice(0, 4)
          .map((item) => item.name)
          .join(", ");
        hint.textContent = `${selected.name}: ${selected.level}/10  |  ${subSkills}`;
      }
    }
  }

  function hitTest(x, y) {
    let winner = -1;
    let smallestDistance = Number.POSITIVE_INFINITY;

    state.points.forEach((point, index) => {
      const distance = Math.hypot(x - point.x, y - point.y);
      if (distance < 14 && distance < smallestDistance) {
        winner = index;
        smallestDistance = distance;
      }
    });

    return winner;
  }

  function setHover(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const nextIndex = hitTest(x, y);

    if (state.hoverIndex !== nextIndex) {
      state.hoverIndex = nextIndex;
      draw();
    }
  }

  function resetHover() {
    if (state.hoverIndex >= 0) {
      state.hoverIndex = -1;
      draw();
    }
  }

  function togglePin(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const index = hitTest(x, y);

    if (index < 0) {
      return;
    }

    state.pinIndex = state.pinIndex === index ? -1 : index;
    draw();
  }

  function init() {
    readPalette();
    resize();

    canvas.addEventListener("mousemove", setHover, { passive: true });
    canvas.addEventListener("mouseleave", resetHover, { passive: true });
    canvas.addEventListener("click", togglePin);

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener(APP_EVENTS.themeChanged, () => {
      readPalette();
      draw();
    });
  }

  return { init };
}
