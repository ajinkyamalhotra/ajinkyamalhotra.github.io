function updateMeta(selector, value) {
  if (!value) {
    return;
  }

  const node = document.head.querySelector(selector);
  if (node) {
    node.setAttribute("content", value);
  }
}

export function createDocumentMetadataProvider({ metadata }) {
  return {
    apply() {
      if (!metadata) {
        return;
      }

      if (metadata.title) {
        document.title = metadata.title;
      }

      updateMeta('meta[name="description"]', metadata.description);
      updateMeta('meta[property="og:title"]', metadata.ogTitle || metadata.title);
      updateMeta('meta[property="og:description"]', metadata.ogDescription || metadata.description);
      updateMeta('meta[property="og:type"]', metadata.ogType);
      updateMeta('meta[property="og:image"]', metadata.ogImage);
      updateMeta('meta[name="theme-color"]', metadata.themeColor);
    },
  };
}
