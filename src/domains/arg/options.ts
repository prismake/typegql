export interface ArgOptions {
  description?: string;
  type?: any;
  isNullable?: boolean;
}

export const defaultArgOptions: ArgOptions = {
  isNullable: false,
};
