export const isToday = (date: Date) => {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
};

export const formatTime12h = (time24: string) => {
  const [h, m] = time24.split(":").map(Number);

  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;

  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
};

export const daysAgo = (date: Date) =>
  Math.floor((Date.now() - date.getTime()) / 86400000);

export const formatDate = (date?: Date | null) =>
  date
    ? date.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "Never";

export const formatStringToDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
