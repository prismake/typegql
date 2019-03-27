import {
  ObjectType,
  Field,
  InputObjectType,
  InputField,
  compileObjectType,
  compileInputObjectType,
} from '~/domains';
import { GraphQLString, GraphQLNonNull } from 'graphql';

@ObjectType()
@InputObjectType()
class InOut {
  @Field()
  @InputField()
  foo: string;
}

describe('Input & Output Object Type', () => {
  it('will properly compile object type that is input and output at once', async () => {
    const output = compileObjectType(InOut);
    const input = compileInputObjectType(InOut);

    expect(output.getFields().foo.type).toEqual(GraphQLString);
    expect(input.getFields().foo.type).toEqual(
      new GraphQLNonNull(GraphQLString),
    );
  });
});
