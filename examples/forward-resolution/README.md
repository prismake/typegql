## Forward resolution

Sometimes you want to know what fields are queried before you'll query your db etc. It often reduces number of db queries etc.

To do that, we can use custom `@Inject` argument decorator that will resolve to list of needed subfields. Such information can be passed to any orm etc.

I've based this decorator on great lib: https://github.com/jakepusateri/graphql-list-fields that is able to get `string[]` of needed fields out of `info` graphql variable.
