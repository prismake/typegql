export interface IArgOptions {
  description?: string
  type?: any
  isNullable?: boolean
  name?: string
}

export const defaultArgOptions: IArgOptions = {
  isNullable: false
}
