export interface ArgOptions {
  description?: string;
  type?: any;
  isNullable?: boolean;
  isList?: boolean;
}

export const defaultArgOptions: ArgOptions = {
  isNullable: false,
  isList: false,
};
