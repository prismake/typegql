import { BaseError } from '../../services/error';

export class InputFieldError extends BaseError {
  constructor(target: Function, fieldName: string, msg: string) {
    const fullMsg = `@InputField ${target.name}.${fieldName}: ${msg}`;
    super(fullMsg);
    this.message = fullMsg;
  }
}
