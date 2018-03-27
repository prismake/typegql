## Basic typeorm database integration example

Example is able to perform such graphql queries:

### Create user and save it to database:

```graphql
mutation {
  createUser(name: "Bob", age: 30) {
    id
    name
    age
  }
}
```

### Get all users:

```graphql
query {
  getAllUsers {
    id
    name
  }
}
```

### Get user by name

```graphql
query {
  getUserByName(name: "Bob") {
    id
    name
  }
}
```

For sake of simplicity and learning curve, all server code is included in single file.

Idea behind:

Decorators of `typeorm` and `typegql` works very well together. We've declared single `User` class like:

```typescript
@Entity() // set this class to be database entity
@ObjectType() // also, make it graphql api public type
export class User extends BaseEntity {
  // define fields as db columns and as graphql fields at the same time
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  name: string;

  // most of fields will be present both in db and in api.
  // fields like password would use only @Column field so they're saved in db but not avaliable in API
  @Column()
  @Field()
  age: number;

  @Field() // computed field that is not present in database!
  isAdult(): boolean {
    return this.age > 21;
  }
}
```

After model is ready, let's define some api interface with some mutation and queries

```typescript
@Schema()
class ApiSchema {
  @Query({ type: [User] }) // as function return type is Promise of user, we need to set type manually as array of users
  async getAllUsers(): Promise<User[]> {
    // we can easily use async functions inside resolvers
    const allUsers = await User.find();
    return allUsers;
  }

  @Query({ type: User })
  async getUserByName(name: string): Promise<User> {
    const user = await User.findOne({ where: { name } });
    return user;
  }

  @Mutation({ type: User })
  async createUser(name: string, age: number): Promise<User> {
    const newUser = User.create({ age, name });
    return await newUser.save();
  }
}
```

Now, with schema defined as well, we need to compile it and it's ready to use. `index.ts` file of this example is fully functional (it includes connecting to the database and setting up express api).

Note for this example to run, you'd need to have some database running locally.
