declare class Error {
    readonly message: string;
    readonly statusCode: number;
    constructor(message: string, statusCode?: number);
}
export default Error;
