import { BaseError } from '../../services/error';

export class InputObjectTypeError extends BaseError {
  constructor(target: Function, msg: string) {
    const fullMsg = `@InputObjectType '${target.name}': ${msg}`;
    super(fullMsg);
    this.message = fullMsg;
  }
}
