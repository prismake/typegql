import { BaseError } from '../../services/error';

export class FieldError extends BaseError {
  constructor(target: Function, fieldName: string, msg: string) {
    const fullMsg = `@ObjectType ${target.name}.${fieldName}: ${msg}`;
    super(fullMsg);
    this.message = fullMsg;
  }
}
