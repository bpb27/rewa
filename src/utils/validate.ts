export const isInteger = (value: string) => {
  return /^\d+$/.test(value);
};

export const isYear = (value: string) => {
  return isInteger(value) && Number(value) > 1900 && Number(value) < 2100;
};
