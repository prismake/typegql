import { BaseError } from '~/services/error';

export class InterfaceTypeError extends BaseError {
  constructor(target: Function, msg: string) {
    const fullMsg = `@InterfaceType '${target.name}': ${msg}`;
    super(fullMsg);
    this.message = fullMsg;
  }
}
