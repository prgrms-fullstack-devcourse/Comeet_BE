export interface SendRequestDTO<R extends object> {
    path: string;
    accessToken: string;
    params?: any;
    cls: { new (...args: any[]): R };
}