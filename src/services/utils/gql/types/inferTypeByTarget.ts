import 'reflect-metadata'

import {
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLScalarType,
  getNullableType,
  GraphQLNonNull
} from 'graphql'
import { GraphQLDateTime } from 'graphql-scalars'
import { Constructor, reflect } from 'typescript-rtti'

// tslint:disable-next-line: use-primitive-type
export type ParsableScalar = String | Number | Boolean | Date

export function isParsableScalar(input: any): input is ParsableScalar {
  return [String, Number, Boolean, Date].includes(input)
}

export function mapNativeTypeToGraphQL(
  input: any //typeof Number | typeof String | typeof Date | typeof Boolean
): GraphQLScalarType {
  switch (input) {
    case String:
      return GraphQLString
    case Number:
      return GraphQLFloat
    case Boolean:
      return GraphQLBoolean
    case Date:
      return GraphQLDateTime
    default:
      throw new Error(`Unsupported native type: ${input}`)
  }
}

export function inferTypeByTarget(target: Constructor<Function>, key?: string) {
  if (!key) {
    return Reflect.getMetadata('design:type', target)
  }
  const reflected = reflect(target)
  const property = reflected.getProperty(key)
  const method = reflected.getMethod(key)

  let rtti
  if (property) {
    rtti = property.type
  } else if (method) {
    rtti = method.returnType
  }
  let inferred
  if (!rtti) {
    throw new Error('could not infer type')
  }

  if (rtti.isClass()) {
    inferred = rtti.as('class').class
  } else if (rtti.isPromise()) {
    // promise
    console.log(
      '~ rtti.as().typeParameters[0].isUnion()',
      key,
      rtti.as('generic').typeParameters[0]
    )

    if (rtti.as('generic').typeParameters[0].isUnion()) {
      const unionTypes = rtti.as('generic').typeParameters[0].as('union').types
      if (unionTypes.length === 2) {
        const withoutNull = unionTypes.filter((x) => !x.isNull())

        return getNullableType(
          mapNativeTypeToGraphQL(withoutNull[0].as('class').class)
        )
      } else {
        throw new Error('Unsupported union type') // decapi doesn't support unions with more than 2 types
      }
    } else {
      inferred = rtti.as('generic').typeParameters[0].as('class').class
      return new GraphQLNonNull(mapNativeTypeToGraphQL(inferred)) // TODO we would like to return nullable when we can detect that this type is implicit, depends on: https://github.com/rezonant/typescript-rtti/issues/16
    }
  } else if (rtti.isArray()) {
    // array
    inferred = rtti.as('array').elementType.as('class').class
    return [mapNativeTypeToGraphQL(inferred)]
  }
  // console.log('~ inferred', inferred)

  if (isParsableScalar(inferred)) {
    return mapNativeTypeToGraphQL(inferred)
  }
  return inferred
}
