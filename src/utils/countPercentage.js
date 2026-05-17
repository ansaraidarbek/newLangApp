export const countPercentage = (trials, success, errors) => {
  if (!trials) return 0;
  return (success / trials) * 100;
};
