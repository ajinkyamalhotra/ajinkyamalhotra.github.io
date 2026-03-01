import { describe, expect, it } from "vitest";
import { createDocumentMetadataProvider } from "@app/providers/document-metadata-provider.js";

describe("document metadata provider", () => {
  it("applies metadata to title and meta tags", () => {
    document.head.innerHTML = `
      <meta name="description" content="" />
      <meta property="og:title" content="" />
      <meta property="og:description" content="" />
      <meta property="og:type" content="" />
      <meta property="og:image" content="" />
      <meta name="theme-color" content="" />
    `;

    createDocumentMetadataProvider({
      metadata: {
        title: "Portfolio Title",
        description: "Desc",
        ogTitle: "OG Title",
        ogDescription: "OG Desc",
        ogType: "website",
        ogImage: "assets/og.png",
        themeColor: "#101010",
      },
    }).apply();

    expect(document.title).toBe("Portfolio Title");
    expect(document.head.querySelector('meta[name="description"]').getAttribute("content")).toBe(
      "Desc",
    );
    expect(document.head.querySelector('meta[property="og:title"]').getAttribute("content")).toBe(
      "OG Title",
    );
    expect(
      document.head.querySelector('meta[property="og:description"]').getAttribute("content"),
    ).toBe("OG Desc");
    expect(document.head.querySelector('meta[property="og:type"]').getAttribute("content")).toBe(
      "website",
    );
    expect(document.head.querySelector('meta[property="og:image"]').getAttribute("content")).toBe(
      "assets/og.png",
    );
    expect(document.head.querySelector('meta[name="theme-color"]').getAttribute("content")).toBe(
      "#101010",
    );
  });

  it("uses title as og:title fallback", () => {
    document.head.innerHTML = `<meta property="og:title" content="" />`;
    createDocumentMetadataProvider({
      metadata: { title: "Fallback Title" },
    }).apply();
    expect(document.head.querySelector('meta[property="og:title"]').getAttribute("content")).toBe(
      "Fallback Title",
    );
  });
});
