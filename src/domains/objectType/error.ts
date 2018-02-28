import { BaseError } from 'services/error';

export class ObjectTypeError extends BaseError {
  constructor(target: Function, msg: string) {
    const fullMsg = `@Type '${target.name}': ${msg}`;
    super(fullMsg);
    this.message = fullMsg;
  }
}
