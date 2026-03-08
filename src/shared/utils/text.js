export function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function normalize(value = "") {
  return String(value).toLowerCase().trim();
}

export function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "--";
  }

  return Intl.NumberFormat("en-US").format(value);
}
