export const qs = (selector, scope = document) => scope.querySelector(selector);

export const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

export function createElement(tagName, className, attributes = {}) {
  const node = document.createElement(tagName);
  if (className) {
    node.className = className;
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (key === "text") {
      node.textContent = String(value);
      return;
    }

    if (key === "html") {
      node.innerHTML = String(value);
      return;
    }

    node.setAttribute(key, String(value));
  });

  return node;
}

export function removeChildren(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}
