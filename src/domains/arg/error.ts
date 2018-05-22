import { BaseError } from '~/services/error';

import { getParameterNames } from '~/services/utils';

export class ArgError extends BaseError {
  constructor(target: Function, fieldName: string, argIndex: number, msg: string) {
    const paramNames = getParameterNames(target.prototype[fieldName]);
    const paramName = paramNames[argIndex];
    const fullMsg = `@Type ${target.name}.${fieldName}(${paramName} <-------): ${msg}`;
    super(fullMsg);
    this.message = fullMsg;
  }
}
