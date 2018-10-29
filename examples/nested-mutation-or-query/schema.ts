import {
  SchemaRoot,
  Query,
  Mutation,
  Field,
  ObjectType,
  compileSchema
} from 'decapi'
import { plainToClass } from 'class-transformer'

@ObjectType()
class Book {
  @Field()
  id: number
  @Field()
  name: string
}

const booksDb: Book[] = [
  { id: 1, name: 'Lord of the Rings' },
  { id: 2, name: 'Harry Potter' }
]

@ObjectType()
class BookMutation {
  private readonly bookId: number

  constructor(bookId: number) {
    this.bookId = bookId
  }

  @Field()
  edit(name: string): Book {
    const book = new Book()
    book.id = this.bookId
    book.name = name
    return book
  }

  @Field()
  remove(name: string): string {
    return `Book with id ${this.bookId} removed.`
  }
}

@SchemaRoot()
class MySchema {
  @Mutation()
  book(bookId: number): BookMutation {
    return new BookMutation(bookId)
  }

  @Query({ type: [Book] })
  books(): Book[] {
    // just a utlitity to cast our POJOs into a class of Book
    return plainToClass(Book, booksDb)
  }
}

export const schema = compileSchema(MySchema)
