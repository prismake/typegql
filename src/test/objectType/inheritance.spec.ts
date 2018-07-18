import { GraphQLString, GraphQLNonNull, printType } from 'graphql';
import { InterfaceType, ObjectType, compileObjectType, Field } from '~/domains';
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
    expect(getClassWithAllParentClasses(Lamborghini)).toHaveLength(3);
  });

  it('implements an interface when extending by an InterfaceType', async () => {
    @InterfaceType()
    class Vehicle {
      @Field() passengers: string;
    }

    @ObjectType()
    class Car extends Vehicle {
      @Field() doorCount: number;
    }

    const compiled = compileObjectType(Car);

    const fields = compiled.getFields();

    expect(fields).toHaveProperty('passengers');
    expect(fields).toHaveProperty('doorCount');
    expect(getClassWithAllParentClasses(Car)).toHaveLength(2);

    expect(compiled.getInterfaces()).toHaveLength(1);
    expect(printType(compiled)).toMatchSnapshot();
  });

  it('can use multiple interfaces from InterfaceType ancestors', async () => {
    @InterfaceType()
    class Entity {
      @Field() name: string;
    }

    @InterfaceType()
    class Vehicle extends Entity {
      @Field() passengers: string;
    }

    @ObjectType()
    class Car extends Vehicle {
      @Field() doorCount: number;
    }

    const compiled = compileObjectType(Car);

    const fields = compiled.getFields();
    expect(fields).toHaveProperty('name');
    expect(fields).toHaveProperty('passengers');
    expect(fields).toHaveProperty('doorCount');
    expect(getClassWithAllParentClasses(Car)).toHaveLength(3);

    expect(compiled.getInterfaces()).toHaveLength(2);
    expect(printType(compiled)).toMatchSnapshot();
  });
});
