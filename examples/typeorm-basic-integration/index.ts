import * as express from 'express';
import { Entity, BaseEntity, ManyToOne, OneToMany } from 'typeorm';
import {
  Schema,
  Query,
  Mutation,
  ObjectType,
  Field,
  compileSchema,
} from 'typegql';
import * as graphqlHTTP from 'express-graphql';

import { PrimaryGeneratedColumn, Column, createConnection } from 'typeorm';

@Entity()
@ObjectType()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  title: string;

  @Column()
  @Field()
  pagesCount: number;

  @ManyToOne(type => User, user => user.books, { lazy: true })
  @Field({ type: () => User })
  author: User;
}

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

  @OneToMany(type => Book, book => book.author)
  @Field({ type: () => [Book] })
  books: Book[];

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

  @Query({ type: [Book] })
  async getAllBooks(): Promise<Book[]> {
    const books = await Book.find();
    return books;
  }

  @Mutation({ type: User })
  async createUser(name: string, age: number): Promise<User> {
    const newUser = User.create({ age, name });
    return await newUser.save();
  }

  @Mutation({ type: Book })
  async createBook(
    title: string,
    pagesCount: number,
    authorId: number,
  ): Promise<Book> {
    const newBook = Book.create({
      title,
      pagesCount,
      author: { id: authorId },
    });
    return await newBook.save();
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
    entities: [User, Book],
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
