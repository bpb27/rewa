export type ApiResponse<T extends () => any> = Awaited<ReturnType<T>>;
export type StaticProps<T extends () => Promise<any>> = ApiResponse<T>['props'];
