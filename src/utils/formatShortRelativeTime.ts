export function formatShortRelativeTime(isoDate: string): string {
  const then = new Date(isoDate).getTime();
  const now = Date.now();
  const diffMinutes = Math.floor((now - then) / (1000 * 60));

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  const diffWeeks = Math.floor(diffDays / 7);
  return diffWeeks === 1 ? "1 week ago" : `${diffWeeks} weeks ago`;
}

export function formatDaysLeft(isoDate: string): string {
  const closes = new Date(isoDate).getTime();
  const now = Date.now();
  const diffDays = Math.ceil((closes - now) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Closed";
  if (diffDays === 0) return "Closes today";
  if (diffDays === 1) return "1 day left";
  return `${diffDays} days left`;
}
