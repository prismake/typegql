export abstract class BaseError extends Error {
  constructor(msg: string) {
    super(msg);
    this.message = msg;
  }
}
