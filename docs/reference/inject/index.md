# Injecting value to resolver

Quite often we need to have access to graphql context inside resolver. Common example could be field like `currentUser`

```graphql
{
  currentUser {
    id
  }
}
```
