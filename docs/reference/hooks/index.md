# Field resolution hooks

In many cases, it might be desired to perform some aditional action before or after some field is resolved. Most common use-case could be authorization of user.

Hooks are special kind of functions added to field with `@Before`, `@After` or `@Guard` decorator.

* [@Before and @After](before-and-after.md)
* [@Guard](guard.md)
