# Installation and setup

Firstly, add `typegql` to your project

`yarn add typegql`

**Important!** To work with `typescript`, you'll need `reflect-medatada` so `typegql` can infer types from your code.

Add `import "reflect-metadata";` somewhere in bootstrap (before any `typegql` decorator is used) of your app eg `app/index.ts`.

## Modify `tsconfig.json`

`typegql` will try to infer types of your fields, when possible. To allow this, you'll have to add following to your `tsconfig.json` `compilerOptions` section:

```
"emitDecoratorMetadata": true,
"experimentalDecorators": true,
```

## Does `typegql` work without typescript?

It absolutely does. Keep in mind, however - without typescript all types will have to be defined explicitly.
