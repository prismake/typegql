export interface Map<Type> {
  [key: string]: Type;
}

export function mapObject<SourceItem, ResultItem>(
  input: Map<SourceItem>,
  mapper: (item: SourceItem, key: string) => ResultItem,
): Map<ResultItem> {
  const result: Map<ResultItem> = {};
  Object.keys(input).map(key => {
    const mapped = mapper(input[key], key);
    result[key] = mapped;
  });
  return result;
}

export function convertObjectToArray<Type>(input: Map<Type>): Type[] {
  return Object.keys(input).map(key => input[key]);
}
