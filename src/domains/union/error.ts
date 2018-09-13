import { BaseError } from '../../services/error';

export class UnionError extends BaseError {
  constructor(target: Function, msg: string) {
    const fullMsg = `@Union '${target.name}': ${msg}`;
    super(fullMsg);
    this.message = fullMsg;
  }
}
