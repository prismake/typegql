import * as express from 'express';
import { Entity, BaseEntity } from 'typeorm';
import { Schema, Query, Mutation, ObjectType, Field, compileSchema } from 'typegql';
import * as graphqlHTTP from 'express-graphql';

import { PrimaryGeneratedColumn, Column, createConnection } from 'typeorm';

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  age: number;

  @Field()
  isAdult(): boolean {
    return this.age > 21;
  }
}

@Schema()
class ApiSchema {
  @Query({ type: [User] })
  async getAllUsers(): Promise<User[]> {
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

const compiledSchema = compileSchema(ApiSchema);

const app = express();

async function startApp() {
  console.log('Connecting to database');
  const connection = await createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'adam',
    password: '',
    database: 'test',
    entities: [User],
    synchronize: true,
  });
  console.log('Connected');

  app.use(
    '/graphql',
    graphqlHTTP({
      schema: compiledSchema,
      graphiql: true,
    }),
  );
  app.listen(3000, () => console.log('API ready on port 3000'));
}

startApp();
