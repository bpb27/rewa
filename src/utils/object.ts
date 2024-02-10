export const keys = <TObject extends object>(obj: TObject) =>
  Object.keys(obj).map(key => key as keyof TObject);

export const bookends = <TObject extends object>(list: TObject[]) => {
  return [list[0], list[list.length - 1]];
};

export const isSameObject = (one: object, two: object) => {
  const first = Object.entries(one).flat().sort();
  const second = Object.entries(two).flat().sort();
  return first.every((item, i) => second.indexOf(item) === i);
};
