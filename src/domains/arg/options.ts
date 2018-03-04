export interface ArgOptions {
  description?: string;
  type?: any;
  nullable?: boolean;
}

export const defaultArgOptions: ArgOptions = {
  nullable: false,
};
