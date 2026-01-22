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
