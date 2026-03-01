export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function unique(values) {
  return [...new Set(values)];
}
