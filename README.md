# GraphQL Yoga ORM

## Required Plugins

```js
{
  secretManager: true,
  publisher: true,
  subscriber: true,
  database: true,
  configManager: true,
  cache: true,
}
```

## How to run

1. Start the dev server on PORT default 7000

   ```bash
   yarn dev
   ```

2. Generate types

   ```bash
     npx prisma generate --schema=./node_modules/@connectfinancial/prisma-database/dist/prisma/schema.prisma
     or
     npx prisma generate --schema=../../node_modules/@connectfinancial/prisma-database/dist/prisma/schema.prisma
   ```
