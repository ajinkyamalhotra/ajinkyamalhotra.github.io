let t;

export function toast(message = "") {
  const el = document.getElementById("toast");
  if (!el) return;

  el.textContent = message;
  el.setAttribute("data-show", "true");

  clearTimeout(t);
  t = setTimeout(() => {
    el.setAttribute("data-show", "false");
  }, 1800);
}
