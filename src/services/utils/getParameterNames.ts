/**
 * taken from https://stackoverflow.com/a/31194949/671457
 */
export function getParameterNames(fn: Function): string[] {
  const asString = Function.toString.call(fn)

  return asString
    .replace(/[/][/].*$/gm, '') // strip single-line comments
    .replace(/\s+/g, '') // strip white space
    .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments
    .split('){', 1)[0]
    .replace(/^[^(]*[(]/, '') // extract the parameters
    .replace(/=[^,]+/g, '') // strip any ES6 defaults
    .split(',')
    .filter(Boolean) // split & filter [""]
}
