export const isInteger = (value: string) => {
  return /^\d+$/.test(value);
};

export const isYear = (value: string) => {
  return isInteger(value) && value.length === 4 && Number(value) > 1900 && Number(value) < 2100;
};
