export class ApiError extends Error {
  status: number;

  constructor(status: number, message = 'Request failed') {
    super(message);
    this.status = status;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}