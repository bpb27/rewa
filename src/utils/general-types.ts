import { isArray, isNumber } from 'remeda';

export type ApiResponse<T extends () => any> = Awaited<ReturnType<T>>;
export type StaticProps<T extends () => Promise<any>> = ApiResponse<T>['props'];
export type ApiError = { success: false; message: string; cause: string };

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & unknown;

export const isNumberArray = (input: unknown): input is number[] => {
  return isArray(input) && input.every(isNumber);
};
