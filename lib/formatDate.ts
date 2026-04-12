import moment from "moment";

export function formatTweetDate(dateStr: string) {
  const created = moment(dateStr);
  const diffSeconds = moment().diff(created, "seconds");
  const diffMinutes = moment().diff(created, "minutes");
  const diffHours = moment().diff(created, "hours");

  if (diffMinutes < 1) return `${diffSeconds}s`;
  if (diffHours < 1) return `${diffMinutes}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (created.isSame(moment().subtract(1, "day"), "day")) return "Yesterday";
  return created.format("MMM D");
}

export function formatPostDate(dateStr: string) {
  return moment(dateStr).format("h:mm A, MMM D, YYYY");
}
