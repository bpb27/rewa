export async function processArraySequentially<T>(
  list: T[],
  promiseFunc: (item: T) => Promise<void>
): Promise<void> {
  for (const item of list) {
    await promiseFunc(item);
  }
}
