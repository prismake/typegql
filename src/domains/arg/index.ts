import { argRegistry } from './registry';
export { compileFieldArgs } from './compiler';
import { ArgOptions, defaultArgOptions } from './options';
// import { getParameterNames } from './services';

export function Arg(options: ArgOptions = {}): ParameterDecorator {
  return (target: Object, fieldName: string, argIndex: number) => {
    // const allArgNames = getParameterNames(target);
    // const inferedArgName = allArgNames[argIndex];
    argRegistry.set(target.constructor, [fieldName, argIndex], {
      ...defaultArgOptions,
      ...options,
    });
  };
}
