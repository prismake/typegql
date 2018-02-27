export type Thunk<Result> = Result | (() => Result);

export type AnyClass = { new (): any };
