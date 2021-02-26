export default function isPromiseLike<TValue>(
  value: PromiseLike<TValue> | TValue
): value is PromiseLike<TValue> {
  return (
    typeof value === 'object' &&
    value &&
    typeof (value as PromiseLike<TValue>).then === 'function'
  )
}
