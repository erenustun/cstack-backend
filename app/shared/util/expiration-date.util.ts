/**
 * Takes a date and returns it in 'MM/YY' format as seen on credit cards
 * @param date
 */
export const formatExpirationDate = (date: Date) =>
  ('0' + (date.getMonth() + 1)).slice(-2) +
  '/' +
  String(date.getFullYear()).slice(-2)
