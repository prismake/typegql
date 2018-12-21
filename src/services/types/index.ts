export type Thunk<Result> = Result | (() => Result)

export type Constructable = new () => any
