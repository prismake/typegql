import { ResolvableType } from 'services/utils';
import { registerArg } from './registry';
export {} from './registry';
export { compileFieldArgs } from './compiler';

// import { getParameterNames } from './services';

interface FieldConfig {
  description?: string;
  type?: ResolvableType;
}

export function Arg(options: FieldConfig = {}): ParameterDecorator {
  return (target: Object, fieldName: string, argIndex: number) => {
    // const allArgNames = getParameterNames(target);
    // const inferedArgName = allArgNames[argIndex];
    registerArg(target.constructor, fieldName, argIndex, { ...options });
  };
}
