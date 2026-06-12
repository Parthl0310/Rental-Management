const formatDate = (date) => {
  const dateObj = new Date(date);

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(dateObj);
};

const calculateDurationLabel = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffMs = end - start;

  if (diffMs <= 0) {
    return "0 hours";
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);

  if (weeks >= 1) {
    return `${weeks} week${weeks > 1 ? "s" : ""}`;
  }

  if (days >= 1) {
    return `${days} day${days > 1 ? "s" : ""}`;
  }

  return `${hours} hour${hours > 1 ? "s" : ""}`;
};

export { formatDate, calculateDurationLabel };