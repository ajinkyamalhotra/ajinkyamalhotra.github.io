import { describe, expect, it } from "vitest";
import { createElement, qs, qsa, removeChildren } from "@shared/utils/dom.js";

describe("dom utilities", () => {
  it("queries single and multiple elements", () => {
    document.body.innerHTML = `
      <div class="x"></div>
      <div class="x"></div>
      <div id="one"></div>
    `;

    expect(qs("#one")).toBeTruthy();
    expect(qsa(".x")).toHaveLength(2);
  });

  it("creates element with class, text, html, and attributes", () => {
    const node = createElement("section", "panel", {
      id: "a1",
      text: "hello",
      "data-kind": "card",
    });

    expect(node.tagName).toBe("SECTION");
    expect(node.className).toBe("panel");
    expect(node.id).toBe("a1");
    expect(node.textContent).toBe("hello");
    expect(node.getAttribute("data-kind")).toBe("card");

    const htmlNode = createElement("div", "", { html: "<span>ok</span>" });
    expect(htmlNode.querySelector("span")?.textContent).toBe("ok");
  });

  it("removes all children from a node", () => {
    const host = document.createElement("div");
    host.appendChild(document.createElement("span"));
    host.appendChild(document.createElement("span"));
    expect(host.childNodes.length).toBe(2);

    removeChildren(host);
    expect(host.childNodes.length).toBe(0);
  });
});
