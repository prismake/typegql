import { BaseError } from 'services/error';

export class SchemaError extends BaseError {
  constructor(target: Function, msg: string) {
    const fullMsg = `@Schema ${target.name}: ${msg}`;
    super(fullMsg);
    this.message = fullMsg;
  }
}

export class SchemaFieldError extends BaseError {
  constructor(target: Function, fieldName: string, msg: string) {
    const fullMsg = `@Schema ${target.name}.${fieldName}: ${msg}`;
    super(fullMsg);
    this.message = fullMsg;
  }
}
