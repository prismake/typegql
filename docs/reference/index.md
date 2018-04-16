# Api Reference

### @ObjectType

```typescript
interface ObjectTypeOptions {
  name?: string; // infered from class name
  description?: string;
}

@ObjectType(options?: ObjectTypeOptions)
```

### @Field

```typescript
 interface FieldOptions {
  name?: string;
  description?: string;
  type?: any | () => any;
  isNullable?: boolean;
}

@Field(options?: FieldOptions)
```

### @InputObjectType

```typescript
interface InputObjectTypeOptions {
  name?: string;
  description?: string;
}

@InputObjectType(options?: InputObjectTypeOptions)
```

### @InputField

```typescript
 interface InputFieldOptions {
  description?: string;
  defaultValue?: any;
  type?: any | () => any;
  name?: string;
  isNullable?: boolean;
}

@InputField(options?: InputFieldOptions)
```

### @Arg

```typescript
 interface ArgOptions {
  description?: string;
  type?: any;
  isNullable?: boolean;
}
@Arg(options?: ArgOptions)
```

### @Inject

```typescript
type InjectorResolver = (
  source: any,
  args: any,
  context: any,
  info: GraphQLResolveInfo,
) => any;

@Inject(resolver: InjectorResolver): ParameterDecorator {
```

### @Context

No decorator options avaliable

```typescript
@Context: ParameterDecorator
```

### @Source

No decorator options avaliable

```typescript
@Source: ParameterDecorator
```

### @Info

No decorator options avaliable

```typescript
@Info: ParameterDecorator
```

### @Before

```typescript
interface HookExecutorResolverArgs {
  source: any;
  args: { [argName: string]: any };
  context: any;
  info: GraphQLResolveInfo;
}

type HookExecutor = (data: HookExecutorResolverArgs) => any | Promise<any>;

@Before(hook: HookExecutor);
```

### @After

```typescript
interface HookExecutorResolverArgs {
  source: any;
  args: { [argName: string]: any };
  context: any;
  info: GraphQLResolveInfo;
}

type HookExecutor = (data: HookExecutorResolverArgs) => any | Promise<any>;

@After(hook: HookExecutor);
```

### @Schema

```typescript
@Schema(): ClassDecorator;
```

### @Query

Has same interface as [@Field](#field) decorator. Can be used only inside @Schema class

### @Mutation

Has same interface as [@Field](#field) decorator. Can be used only inside @Schema class

### @Union

```typescript
interface UnionOptions {
  name?: string;
  resolveTypes?: (value: any, context: any, info: GraphQLResolveInfo): any; // must return type resolvable to one of defined in `types` option
  types: any[] | () => any[];
}

interface UnionTypeResolver {
  (value: any, context: any, info: GraphQLResolveInfo): any;
}

@Union(options: UnionOptions): ClassDecorator;
```

### registerEnum

```typescript
interface EnumOptions {
  name: string;
  description?: string;
}

registerEnum(enumDef: Object, options: EnumOptions | string): void;
```

### compileSchema

```typescript
compileSchema(schemaTarget: Function): GraphQLSchema
```

### compileObjectType,

```typescript
compileObjectType(schemaTarget: Function): GraphQLObjectType
```

### compileInputObjectType,

```typescript
compileInputObjectType(schemaTarget: Function): GraphQLInputObjectType
```
