export const keys = <TObject extends object>(obj: TObject) =>
  Object.keys(obj).map(key => key as keyof TObject);

export const bookends = <TObject extends object>(list: TObject[]) => {
  return [list[0], list[list.length - 1]];
};
