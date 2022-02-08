import 'reflect-metadata'

import {
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLScalarType
} from 'graphql'
import { GraphQLDateTime } from 'graphql-scalars'

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

export function inferTypeByTarget(target: Function, key?: string) {
  if (!key) {
    return Reflect.getMetadata('design:type', target)
  }

  const returnType = Reflect.getMetadata('design:returntype', target, key)
  if (returnType) {
    return returnType
  }

  return Reflect.getMetadata('design:type', target, key)
}
