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

export function parseNativeTypeToGraphQL(input: any): GraphQLScalarType {
  switch (input) {
    case String:
      return GraphQLString
    case Number:
      return GraphQLFloat
    case Boolean:
      return GraphQLBoolean
    case Date:
      return GraphQLDateTime
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

  if (rtti.isClass()) {
    inferred = rtti.as('class').class
  } else if (rtti.isGeneric()) {
    // promise
    if (rtti.as('generic').typeParameters[0].isUnion()) {
      const unionTypes = rtti.as('generic').typeParameters[0].as('union').types
      if (unionTypes.length === 2) {
        const withoutNull = unionTypes.filter((x) => !x.isNull())

        return getNullableType(
          parseNativeTypeToGraphQL(withoutNull[0].as('class').class)
        )
      }
    } else {
      inferred = rtti.as('generic').typeParameters[0].as('class').class
      return new GraphQLNonNull(parseNativeTypeToGraphQL(inferred))
    }
  } else if (rtti.isArray()) {
    // array
    inferred = rtti.as('array').elementType.as('class').class
    return [parseNativeTypeToGraphQL(inferred)]
  }
  // console.log('~ inferred', inferred)

  if (isParsableScalar(inferred)) {
    return parseNativeTypeToGraphQL(inferred)
  }
  return inferred
}
