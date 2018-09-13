import { BaseError } from '../../services/error';

export class SchemaRootError extends BaseError {
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
export class SchemaCompilationError extends BaseError {
  constructor(msg: string) {
    const fullMsg = `SchemaCompilationError: ${msg}`;
    super(fullMsg);
    this.message = fullMsg;
  }
}
