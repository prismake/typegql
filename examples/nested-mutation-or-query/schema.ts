import {
  SchemaRoot,
  Query,
  Mutation,
  Field,
  ObjectType,
  compileSchema
} from 'decapi'

@ObjectType()
class Book {
  @Field()
  id: number
  @Field()
  name: string

  constructor({ id, name }) {
    this.id = id
    this.name = name
  }

  @Field()
  edit(name: string): Book {
    this.name = name
    return this
  }

  @Field()
  remove(): string {
    return `Book with id ${this.id} removed.`
  }
}

const booksDb: Book[] = [
  new Book({ id: 1, name: 'Lord of the Rings' }),
  new Book({ id: 2, name: 'Harry Potter' })
]

@SchemaRoot()
class MySchema {
  @Mutation({ type: Book })
  book(bookId: number): Book {
    return booksDb.find(({ id }) => id === bookId)
  }

  @Query({ type: [Book] })
  books(): Book[] {
    // just a utility to cast our POJOs into a class of Book
    return booksDb
  }
}

export const schema = compileSchema(MySchema)
