import { GraphQLString, GraphQLNonNull } from 'graphql';
import { InterfaceType, compileInterfaceType, Field } from '~/domains';
import { getClassWithAllParentClasses } from '~/services/utils';

describe('Type inheritance', () => {
  it('Will pass fields from parent class', () => {
    class Base {
      @Field() baseField: string;
    }

    @InterfaceType()
    class Foo extends Base {}

    const { baseField } = compileInterfaceType(Foo).getFields();

    expect(baseField.type).toEqual(GraphQLString);
  });

  it('Will overwrite fields in child class', () => {
    class Base {
      @Field() foo: string;
      @Field() bar: string;
    }

    @InterfaceType()
    class Foo extends Base {
      @Field({ isNullable: false })
      foo: string;
    }

    const { foo, bar } = compileInterfaceType(Foo).getFields();

    expect(bar.type).toEqual(GraphQLString);
    expect(foo.type).toEqual(new GraphQLNonNull(GraphQLString));
  });

  it('picks up all the properties even for long chain of extended classes', async () => {
    @InterfaceType()
    class Vehicle {
      @Field() passengers: string;
    }

    @InterfaceType()
    class Car extends Vehicle {
      @Field() doorCount: number;
    }

    @InterfaceType()
    class Lamborghini extends Car {
      @Field() speed: string;
    }
    const compiled = compileInterfaceType(Lamborghini);

    const fields = compiled.getFields();

    expect(fields).toHaveProperty('passengers');
    expect(fields).toHaveProperty('doorCount');
    expect(fields).toHaveProperty('speed');
    expect(getClassWithAllParentClasses(Lamborghini).length).toBe(3);
  });
});
