# Installation and setup

Firstly, add `typegql` to your project

`yarn add typegql`

also, you'll need `reflect-medatada` so `typegql` can infer types from your code.

_Dont forget_ to add `import "reflect-metadata";` somewhere in bootstrap place of your app eg `app/index.ts`

## Setup with typescript

`typegql` will try to infer types of your fields, when possible. To allow this, you'll have to add following to your `tsconfig.json` `compilerOptions` section:

```
"emitDecoratorMetadata": true,
"experimentalDecorators": true,
```
