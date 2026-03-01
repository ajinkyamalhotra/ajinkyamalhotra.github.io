export function formatDateInEastern(isoValue) {
  if (!isoValue) {
    return "--";
  }

  try {
    const date = new Date(isoValue);
    return date.toLocaleString("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });
  } catch {
    return "--";
  }
}

export function formatRelativeAge(isoValue) {
  if (!isoValue) {
    return "--";
  }

  const parsed = new Date(isoValue).getTime();
  if (Number.isNaN(parsed)) {
    return "--";
  }

  const diffMs = Date.now() - parsed;
  if (diffMs < 0) {
    return "just now";
  }

  const minutes = Math.floor(diffMs / (60 * 1000));
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
