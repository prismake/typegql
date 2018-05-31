import { GraphQLString, GraphQLNonNull } from 'graphql';
import { ObjectType, compileObjectType, Field } from '~/domains';
import { getClassWithAllParentClasses } from '~/services/utils';

describe('Type inheritance', () => {
  it('Will pass fields from parent class', () => {
    class Base {
      @Field() baseField: string;
    }

    @ObjectType()
    class Foo extends Base {}

    const { baseField } = compileObjectType(Foo).getFields();

    expect(baseField.type).toEqual(GraphQLString);
  });

  it('Will overwrite fields in child class', () => {
    class Base {
      @Field() foo: string;
      @Field() bar: string;
    }

    @ObjectType()
    class Foo extends Base {
      @Field({ isNullable: false })
      foo: string;
    }

    const { foo, bar } = compileObjectType(Foo).getFields();

    expect(bar.type).toEqual(GraphQLString);
    expect(foo.type).toEqual(new GraphQLNonNull(GraphQLString));
  });

  it('picks up all the properties even for long chain of extended classes', async () => {
    @ObjectType()
    class Vehicle {
      @Field() passengers: string;
    }

    @ObjectType()
    class Car extends Vehicle {
      @Field() doorCount: number;
    }

    @ObjectType()
    class Lamborghini extends Car {
      @Field() speed: string;
    }
    const compiled = compileObjectType(Lamborghini);

    const fields = compiled.getFields();

    expect(fields).toHaveProperty('passengers');
    expect(fields).toHaveProperty('doorCount');
    expect(fields).toHaveProperty('speed');
    expect(getClassWithAllParentClasses(Lamborghini).length).toBe(3);
  });
});
