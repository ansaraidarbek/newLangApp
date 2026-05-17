export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}/${day}/${year}`;
};

export const getFormattedDate = () => formatDate(new Date());

export const parseDate = (str) => {
  const [m, d, y] = str.split('/').map(Number);
  return new Date(y, m - 1, d);
};

export const dateOffset = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return formatDate(d);
};

export const shortDate = (str) => str.slice(0, 5);
