import { GraphQLObjectType } from 'graphql';

export function isObjectType(input: any): input is GraphQLObjectType {
  return typeof input.getFields === 'function'; // TODO: More precise
}
