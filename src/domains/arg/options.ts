export interface ArgOptions {
  description?: string
  type?: any
  isNullable?: boolean
  name?: string
}

export const defaultArgOptions: ArgOptions = {
  isNullable: false,
}
