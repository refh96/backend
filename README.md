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
#### Instrucciones adicionales
para generar el app key en el archivo .env utiliza el comando adonis key:generate o desde linux node ace key:generate.

Para el entorno de desarrollo en localhost se ocupo XAMPP Control Panel para correr apache y MYSQL y poder administrar la base de datos desde local. 
Se crea una base de datos con el nombre que sale en el .env en este caso "backend" y no olvides ejecutar el npm install para agregar las dependencias del backend, luego desde la terminal del proyecto usamos el comando adonis migration:run(si se requiere utiliza --force) para crear las tablas y el comando adonis seed(si se requiere utiliza --force) para rellenar las tablas, para correr el proyecto usamos el comando adonis serve --dev.
