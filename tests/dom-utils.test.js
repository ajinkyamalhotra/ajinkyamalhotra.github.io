import { describe, expect, it } from "vitest";
import { createElement, qs, qsa } from "@shared/utils/dom.js";

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
});
