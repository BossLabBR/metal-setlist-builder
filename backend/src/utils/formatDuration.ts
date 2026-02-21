export function formatDuration(ms: number | null | undefined): string | null {
  if (ms === null || ms === undefined || typeof ms !== "number" || isNaN(ms)) {
    return null;
  }

  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
