## Nested mutations

Sometimes, nested mutations and queries are very handy and can help to keep code more encapsulated

This example will allow mutation like

```graphql
mutation {
  book(bookId: 2) {
    edit(name: "Lord of the Rings") {
      id
      name
    }
  }
}
```

instead of

```graphql
mutation {
  editBook(bookId: 2, name: "Lord of the Rings") {
    id
    name
  }
}
```
