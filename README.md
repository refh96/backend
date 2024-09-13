# Adonis API application

This is the boilerplate for creating an API server in AdonisJs, it comes pre-configured with.

1. Bodyparser
2. Authentication
3. CORS
4. Lucid ORM
5. Migrations and seeds

## Setup

Use the adonis command to install the blueprint

```bash
adonis new yardstick --api-only
```

or manually clone the repo and then run `npm install`.


### Migrations

Run the following command to run startup migrations.

```js
adonis migration:run
```
Para el entorno de desarrollo en localhost se ocupo XAMPP Control Panel para correr apache y MYSQL y poder administrar la base de datos desde local 
se crea una base de datos con el nombre que sale en el .env en este caso "backend" luego desde la terminal del proyecto usamos el comando adonis migration:run para crear las tablas y el comando adonis seed para rellenar la tabla de servicios para correr el proyecto usamos el coando adonis serve --dev y no olvides ejecutar el npm install para las dependencias del backend.
