export const keys = <TObject extends object>(obj: TObject) =>
  Object.keys(obj).map(key => key as keyof TObject);
