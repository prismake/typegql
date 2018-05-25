import {
  Schema,
  Query,
  Mutation,
  Field,
  ObjectType,
  compileSchema,
} from 'typegql';

@ObjectType()
class Book {
  @Field() id: number;
  @Field() name: string;
}

const booksDb: Book[] = [
  { id: 1, name: 'Lord of the Rings' },
  { id: 2, name: 'Harry Potter' },
];

@ObjectType()
class BookMutation {
  private readonly bookId: number;

  constructor(bookId: number) {
    this.bookId = bookId;
  }

  @Field()
  edit(name: string): Book {
    const book = new Book();
    book.id = this.bookId;
    book.name = name;
    return book;
  }

  @Field()
  remove(name: string): string {
    return `Book with id ${this.bookId} removed.`;
  }
}

@Schema()
class MySchema {
  @Mutation()
  book(bookId: number): BookMutation {
    return new BookMutation(bookId);
  }

  @Query()
  hello(): string {
    return 'World!';
  }
}

export const schema = compileSchema(MySchema);
