export function createNavigationShortcutsFeature({ onFocusProjectSearch, onCycleThemeBackward }) {
  return {
    init() {
      window.addEventListener("keydown", (event) => {
        const targetTag = event.target?.tagName?.toLowerCase() || "";
        const typing =
          targetTag === "input" || targetTag === "textarea" || event.target?.isContentEditable;
        if (typing) {
          return;
        }

        if (event.key === "/") {
          event.preventDefault();
          onFocusProjectSearch?.();
          return;
        }

        if (event.key.toLowerCase() === "t" && event.shiftKey) {
          event.preventDefault();
          onCycleThemeBackward?.();
        }
      });
    },
  };
}
