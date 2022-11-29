export class ErrorObject extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public status?: string,
    public operational?: boolean
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${this.statusCode}.startsWith(4)` ? "fail" : "error";
    this.operational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
