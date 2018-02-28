import { argRegistry } from './registry';
export { compileFieldArgs } from './compiler';

// import { getParameterNames } from './services';

interface FieldConfig {
  description?: string;
  type?: any;
}

export function Arg(options: FieldConfig = {}): ParameterDecorator {
  return (target: Object, fieldName: string, argIndex: number) => {
    // const allArgNames = getParameterNames(target);
    // const inferedArgName = allArgNames[argIndex];
    argRegistry.set(target.constructor, [fieldName, argIndex], { ...options });
  };
}
