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
import {
  Constructor,
  reflect,
  ReflectedLiteralRef,
  ReflectedTypeRef
} from 'typescript-rtti'
import { Literal, RtType } from 'typescript-rtti/dist/common'

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

const inferUnion = (unionTypes: ReflectedTypeRef<RtType>[]) => {
  console.log('~ unionTypes', unionTypes)
  const withoutEmpties = unionTypes.filter(
    (x) => !x.isNull() && !x.isUndefined()
  )

  if (withoutEmpties.length > 1) {
    // TODO: handle union of two object types
    throw new Error('Cannot infer the type, unions of types are not supported')
  }
  if (withoutEmpties[0] instanceof ReflectedLiteralRef) {
    const rttLiteral = withoutEmpties[0].as('literal')
    const literalType = rttiLiteralToGql(rttLiteral)
    if (unionTypes.length === 1) {
      return literalType
    }
    return getNullableType(literalType)
  }

  const mappedGraphqlType = mapNativeTypeToGraphQL(
    withoutEmpties[0].as('class').class
  )

  if (unionTypes.length === 1) {
    return mappedGraphqlType
  }
  return getNullableType(mappedGraphqlType)
}

export function inferTypeByTarget(target: Constructor<Function>, key?: string) {
  if (!key) {
    return Reflect.getMetadata('design:type', target)
  }
  const reflected = reflect(target)
  const property = reflected.getProperty(key)
  const method = reflected.getMethod(key)
  console.log('~ key', key)

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
  } else if (rtti.isUnion()) {
    return inferUnion(rtti.as('union').types)
  } else if (rtti.isGeneric()) {
    // isPromise doesn't work properly here
    // promise
    if (rtti.as('generic').typeParameters[0].isUnion()) {
      const unionTypes = rtti.as('generic').typeParameters[0].as('union').types

      if (unionTypes.length >= 2) {
        return inferUnion(unionTypes)
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
