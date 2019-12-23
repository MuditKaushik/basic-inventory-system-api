export interface ICustomError {
    actualError: any;
    method: string;
    message: string;
    status?: number;
    customError?: Error;
}
