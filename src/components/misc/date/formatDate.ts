/**
 * @function formatDate - Formats a date string into a human-readable format.
 *
 * @param date - The date string to format.
 * @returns A formatted date string in the format "Month Day, Year". For example, "January 1, 2026".
 */

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });