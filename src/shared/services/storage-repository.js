export function createLocalStorageRepository(storageKey, fallbackValue) {
  return {
    read() {
      try {
        const raw = localStorage.getItem(storageKey);
        return raw === null ? fallbackValue : JSON.parse(raw);
      } catch {
        return fallbackValue;
      }
    },
    write(value) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(value));
      } catch {
        // Ignore storage errors.
      }
    },
    remove() {
      try {
        localStorage.removeItem(storageKey);
      } catch {
        // Ignore storage errors.
      }
    },
  };
}
