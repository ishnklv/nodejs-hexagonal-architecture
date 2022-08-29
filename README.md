# NestJS Template

This project contains a template for an API server using the [NestJS Framework](https://nestjs.com/).

It offers a lot of features out of the box to reduce the time to get started.
It uses a clean architecture to allow you to write clean, testable and maintainable code.

* [Installation](#-how-to-install-and-run)
* [Features](#-features)
* [Customization](#-customizing-the-template-for-your-needs)
* [Contributing](#-contributing)
* [License](#-license)

## 💿 How to install and run

This section describes how to install and run the application for development and production.

### ▶ Prerequisites

Install

* [npm](https://www.npmjs.com/)
* [Node.js](https://nodejs.org/en/)
* [NestJS](https://nestjs.com/)
* [Docker](https://www.docker.com/)

### ▶ Installation and running

#### Development

1. Run `npm install` to install the dependencies.
2. Run `npm run docker-compose:up:local` to start the postgres and pgadmin container.  
   For details, see `docker-compose.local.yml`.
3. Run `npm run start:dev` to start the app.
4. Go to `localhost:5000` to access the app.
5. Go to `localhost:5000/api` to access the Swagger API docs of the app.
6. Run `npm run docker-compose:down:local` to shut down the containers.

### ▶ Getting started with the template

The first thing you want to do when using this template is to customize it for your needs.

1. Change the `name` in [package.json](package.json)
1. Change the env variables for the local development environment in [.env.local](.env.local)
1. Change the name in the [Swagger API docs](src/shared/configs/swagger.config.ts)

## ✨ Features

This section describes what this template offers and how to configure the features to your needs.

### ▶ Clean architecture

The architecture of this template is inspired by

* [Domain Driven Hexagonal Architecture](https://github.com/Sairyss/domain-driven-hexagon/tree/master/src)
* [Explicit Architecture](https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together/)
* [The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

#### Domain

The domain layer contains entities, value objects and aggregates.

Entities are objects with properties and methods, or a set of data structures and functions.
Value Objects are objects that do not have an identity. Examples are an address or email.
Aggregates is a cluster of domain objects that are treated as a single unit.

An example for implemented domain objects can be found in the [Users Module](src/modules/user/domain).

#### Repository

Repositories handle data persistence and retrieval.

A repository (`*.repository.ts`, in our case a typeorm repository) implements the repository interface (`*.repository.interface`).
Services depend on repository interfaces, not on repository implementations.
This allows mocking and changing repository implementations easily.

A repository persists an Orm Entity (`*.orm-entity.ts`).
A domain entity (`domain/entities/*.entity.ts`) is mapped from and to an Orm Entity with an Orm Mapper (`*.orm-mapper.ts`).

One repository per aggregate is good practice.

An example for an implemented repository can be found in the [Users Module](src/modules/user/repository).

#### Commands

Commands are use cases that change/write data.

Commands contain a controller (`*.controller.ts`) and a service (`*.service.ts`).
If you use other protocols than HTTP, you can simply replace the HTTP controller.
Separating controllers and services also allows supporting multiple protocols.

The controller receives an HTTP request (`*.request.ts`).
The request object contains annotations for validation and swagger documentation.

A controller creates a command (`*.command.ts`), which encapsulated parameters, and passes it to the service.
The service returns a result (`*.result.ts`), which encapsulated result values.

The controller receives the result from the service.
The controller processes the result and returns an HTTP response (`*.response.ts`).
The response object contains annotations for swagger documentation.

An example for an implemented command can be found in the [Users Module](src/modules/user/commands).

#### Queries

Queries are use cases that retrieve data, i.e. do not change data in the database.

Like commands, queries contain a controller (`*.controller.ts`) and optionally a service (`*.service.ts`). If you do not have a lot of logic, you can omit the service and call the repository directly from the controller.

A controller creates a query (`*.query.ts`) that contains parameters needed to retrieve data.
The controller passes the query to the service.
The service retrieves data from the repository and returns a result (`*.result.ts`) to the controller.

The controller returns a response (`*.response.ts`).

An example for a query can be found in the [Root Module](src/modules/root/queries).

### ▶ Events

Domain event indicates that something happened in a domain that you want other parts of the same domain (in-process) to be aware of.

Domain events are located in `src/modules/{module}/domain/events/*.domain.ts`.
Domain handlers that handle the events are located in `src/modules/{module}/event-handlers/*.event-handlers.ts` 

The [DomainEventService](src/shared/libs/base/modules/commands/publish-domain-events/domain-event.service.ts) is responsible for publishing events.
It uses the [NestJS Event Emitter](https://github.com/nestjs/event-emitter) module for publishing and subscribing to events.

Instead of publishing events directly, we can prepare multiple events we want to publish and publish them together as transaction.

### ▶ CRUD Operations

CRUD (Create, read, update, delete) operations for an entity is implemented using [@nestjsx/crud](https://github.com/nestjsx/crud).

An example for the implementation is provided for the [User](src/modules/user/crud).

The [crud service](src/modules/user/crud/crud.service.ts) overrides some functions of the base crud service to
support domain events and logging. 

### ▶ Authentication and authorization

The endpoints are protected using JWT or Google OAuth.

A JWT can be acquired using the `/auth/jwt` api and providing the email of a user.
If you use JWT for production, you should also check for a provided password!

Google OAuth can also be used for authentication.
The client-id (`GOOGLE_CLIENT_ID`) and secret (`GOOGLE_SECRET`) can be configured in the .env files.

The type of authentication can be selected with the `auth-type`-Header in a request. If none is provided, JWT is used.

### ▶ Validation

Validation of requests is implemented as described in the [NestJS docs](https://docs.nestjs.com/techniques/validation).

### ▶ Configuration

The app can be configured using the .env files.  
The `.env.template` serves as a template and contains a description for all available environment variables.

If you do not want to use .env files, you can also just set the env variables in your environment.

### ▶ Docker

There are different `docker-compose.yml` files for different environments.

* *Development environment* starts with `docker-compose.local.yml`.  
  They include a postgresql database and a pgadmin container.
  The env vars are read from `.env.local`.
* *E2e-Test environment* starts with `docker-compose.e2e.yml`.  
  It includes a postgresql database.
  The env vars are read from `.env.e2e`.

> When connecting from another docker container, the database host has to be the name of the service in the docker-compose file.  
> For example, if you want to connect from pgadmin to the database, the host name is "postgres", not localhost.  
> See `docker-compose.local.yml`.

### ▶ Database

Data is persisted using the `typeorm` package.

TODO Link to the respective scripts in package.json

#### Repository

TODO

#### Entity mapping

Domain entities have to be mapped to Orm entities before saving them in the database.
Orm entities have to be mapped to domain entities after retrieving them from the database and before returning them to a service (or controller).

This is done by an orm mapper.

An example for an orm mapper can be found in the [User Module](src/modules/user/repository/user.orm-mapper.ts).

#### Migrations

[Typeorm](https://github.com/typeorm/typeorm/blob/master/docs/migrations.md#running-and-reverting-migrations) handles database migrations.
Migrations are located in `src/migrations`.

Migrations are run automatically when the application starts. See `src/shared/configs/orm.config.ts`.

There are some scripts in `package.json` for migrations.

* `migration:generate` generates migrations. 
  
  It uses the `.env.local` file to connect to the dev database to check if there are migrations that need to be created.
  
  The parameter `-n` in the npm script is used to pass a name for the migration to typeorm.
  
  New migrations are generated running the script like `npm run migration:generate migration-name`.
  For example, the create-user migration in `src/migrations` was created using `npm run migration:generate create-user`.
* `migration:run` applies the migrations to the database which connection details are defined in the .env file passed to the script.
* `migration:revert` reverts the latest executed migration in the database.

#### Seeders

The development database can be seeded.
It uses the [Typeorm-Seeding](https://github.com/w3tecch/typeorm-seeding) package.

The seeds are defined in the `src/modules/{module}/repository/seeders/*.seeds.ts` files.
The seeders are defined in the `src/modules/{module}/repository/seeders/*.seeder.ts` files.

Run the following scripts to seed the db:

1. (Optional) `npm run schema:drop` to drop the database.
1. `npm run seed:run` to seed the database.

You do not have to run `npm run schema:sync` to synchronize the schema because migrations are automatically run.

To be able to authenticate and get a jwt token, you have to seed the database with an initial user (e.g., an admin).

### ▶ Testing

All tests (unit + e2e) are run using `npm run test:all`.

#### Unit tests

Unit tests validate a single component (controller, service, ...).
All dependencies are mocked.

##### Testing controllers

When testing controllers, a mock service is injected.
You can define what the mock service returns.

An example can be found in `src/modules/user/commands/custom-use-case/custom-use-case.controller.spec.ts`.

##### Testing services

When testing services, a mock repository is injected.
You can define what the mock repository returns.

An example can be found in `src/modules/user/commands/custom-use-case/custom-use-case.service.spec.ts`.

#### e2e tests

e2e tests validate the data flow from controller to database.
They run with a real database containing dummy data.
Dummy data with random or fixed data is defined using fixtures (`test/fixtures/*`).
It is inserted into the db using the `typeorm-fixtures-cli` package.

e2e tests are run using `npm run test:e2e`.
e2e tests can be debugged using `npm run test:debug` and then `npm run test:e2e`.

The `docker-compose.e2e.yml` provides a test database, which can be started using `npm run docker-compose:up:e2e` and stopped using `docker-compose:down:e2e`.

### ▶ API Documentation

API documentation is provided in the form of OpenAPI V3.

The API documentation is available under `/api`.
The route to host the documentation can be configured in `src/shared/configs/app.routes.ts`.

### ▶ Logging

This template uses the default [NestJS Logger](https://docs.nestjs.com/techniques/logger).

Normally, the production environment where the application is deployed takes care of persisting the log.

## 🛠 Customizing the template for your needs

This section describes how to customize and add features to the application.

### ▶ Changing the database

If you do not want to use typeorm, you can replace
the [typeorm implementation](src/shared/libs/base/modules/repository/typeorm.base.repository.ts) with another database
implementation.

Since the services only depend on an interface of a repository, the underlying implementation can be easily changed by
providing another implementation in the respective module. For example,
the [User Module](src/modules/user/user.module.ts) can provide a cloud-service instead of the typeorm-repository.

### ▶ Extending the template

This section shows some features that can be added to the app.

#### Add rate limiting

You can add rate limiting as described in the [NestJS docs](https://docs.nestjs.com/security/rate-limiting).

Normally, this is taken care of by a reverse proxy.

#### Add compression for HTTP responses

You can add compression for HTTP responses as described in
the [NestJS docs](https://docs.nestjs.com/techniques/compression).

Normally, this is taken care of by a reverse proxy.

## 👨‍💻👩‍💻 Contributing

Improvements and suggestions in the form of issues and merge requests are welcome.

## 📝 License

MIT
