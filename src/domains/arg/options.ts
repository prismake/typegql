export interface ArgOptions {
  description?: string;
  type?: any;
  isNullable?: boolean;
  defaultValue?: any;
}

export const defaultArgOptions: ArgOptions = {
  isNullable: false,
};
