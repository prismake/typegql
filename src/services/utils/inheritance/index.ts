export function getClassWithAllParentClasses(target: Function) {
  const result = [target]
  let currentNode = target
  while (Object.getPrototypeOf(currentNode)) {
    const parent = Object.getPrototypeOf(currentNode)

    if (parent === Function.prototype) break
    result.push(parent)
    currentNode = parent
  }
  return result.reverse() // reverse so we go from parents to children
}
