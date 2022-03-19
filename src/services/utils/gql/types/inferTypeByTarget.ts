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
import { Constructor, reflect, ReflectedLiteralRef } from 'typescript-rtti'
import { Literal } from 'typescript-rtti/dist/common'

// tslint:disable-next-line: use-primitive-type
export type ParsableScalar = String | Number | Boolean | Date

export function isParsableScalar(input: any): input is ParsableScalar {
  return [String, Number, Boolean, Date].includes(input)
}

export function mapNativeTypeToGraphQL(input: any): GraphQLScalarType {
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
      throw new Error(`Could not parse native type to graphql: ${input}`)
  }
}

function rttiLiteralToGql(rttLiteral: ReflectedLiteralRef<Literal>) {
  let literalType

  if (rttLiteral.isBooleanLiteral()) {
    literalType = GraphQLBoolean
  } else if (rttLiteral.isStringLiteral()) {
    literalType = GraphQLString
  } else if (rttLiteral.isNumberLiteral()) {
    literalType = GraphQLFloat
  }

  return literalType
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
  } else {
    throw new Error('Could not find property or method')
  }
  let inferred

  if (rtti.isClass()) {
    inferred = rtti.as('class').class
  } else if (rtti.isGeneric()) {
    // isPromise doesn't work properly here
    // promise
    if (rtti.as('generic').typeParameters[0].isUnion()) {
      const unionTypes = rtti.as('generic').typeParameters[0].as('union').types

      if (unionTypes.length === 2) {
        const withoutEmpties = unionTypes.filter(
          (x) => !x.isNull() || !x.isUndefined()
        )

        if (withoutEmpties.length === 2) {
          // TODO: handle union of two types
          throw new Error('Cannot infer the type')
        }
        if (withoutEmpties[0] instanceof ReflectedLiteralRef) {
          const rttLiteral = withoutEmpties[0].as('literal')
          const literalType = rttiLiteralToGql(rttLiteral, literalType)
          return getNullableType(literalType)
        }

        return getNullableType(
          mapNativeTypeToGraphQL(withoutEmpties[0].as('class').class)
        )
      } else {
        throw new Error('Unsupported union type') // decapi doesn't support unions with more than 2 types
      }
    } else {
      inferred = rtti.as('generic').typeParameters[0].as('class').class
      return new GraphQLNonNull(mapNativeTypeToGraphQL(inferred)) // TODO we would like to return nullable when we can detect that this type is implicit, depends on: https://github.com/rezonant/typescript-rtti/issues/16
    }
  } else if (rtti.isArray()) {
    const elementType = rtti.as('array').elementType
    if (elementType.isClass()) {
      inferred = elementType.as('class').class
    } else if (elementType.isUnion()) {
      const withoutEmpties = elementType
        .as('union')
        .types.filter((x) => !x.isNull() && !x.isUndefined())

      inferred = withoutEmpties[0].as('class').class
      return [getNullableType(mapNativeTypeToGraphQL(inferred))]
    }

    return [new GraphQLNonNull(mapNativeTypeToGraphQL(inferred))]
  }
  // console.log('~ inferred', inferred)

  if (isParsableScalar(inferred)) {
    return mapNativeTypeToGraphQL(inferred)
  }
  return inferred
}
