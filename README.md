# cStack - Backend: A Nest.js Application

<a href="https://typeorm.io/">![Static Badge](https://img.shields.io/badge/TypeORM%20-%20blue?style=for-the-badge&logoColor=white)</a>
<a href="https://docs.nestjs.com/">![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logoColor=white)</a>
<a href="https://graphql.org/">![GraphQL](https://img.shields.io/badge/-GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)</a>
<a href="https://docs.docker.com/get-started/">![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)</a>
<a href="https://expressjs.com/de/starter/hello-world.html">![Fastify](https://img.shields.io/badge/Fastify-%23000000.svg?style=for-the-badge&logoColor=white)</a>
<a href="https://www.apollographql.com/docs/apollo-server/">![Apollo-GraphQL](https://img.shields.io/badge/-ApolloGraphQL-311C87?style=for-the-badge&logoColor=white)</a>
<a href="https://typegraphql.com/docs/introduction.html">![Type-graphql](https://img.shields.io/badge/-TypeGraphQL-%23C04392?style=for-the-badge&logoColor=white)</a>
<a href="https://www.typescriptlang.org/docs/">![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)</a>
<a href="https://www.postgresql.org/docs/current/index.html">![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)</a>

---
#### This E-Commerce application is built with Nest.js, a renowned Node.js framework recognized for its ability to create highly scalable and performant server-side applications.
#### This project serves as the sturdy backbone for my frontend, seamlessly bridging the gap between the server and user interface.

---
## 📃 Requirements
- Make sure that you have Docker and Docker Compose installed
    - Windows or macOS:
      [Install Docker Desktop](https://www.docker.com/get-started)
    - Linux: [Install Docker](https://www.docker.com/get-started) and then
      [Docker Compose](https://github.com/docker/compose)

## 🚀 Running Locally
Clone the project, navigate into project directory & install dependencies:
```bash
  git clone https://github.com/erenustun/cstack-backend && cd cstack-backend && npm i
```

### Environment Variables
- Copy `.env.example` to `.env`:
```bash
  cp .env.example .env
```

### Launch the docker container (PostgreSQL Server)
This command runs the docker container.
```bash
npm run docker:start
```

### Launch the application in development mode
This command starts the nest.js application.
```bash
npm run dev
```

---
## 📙 Helpful
### GraphQL Playground (API Documentation) - Explore and Learn
```bash
# Insert the graphql url (e.g. http://localhost:4000/graphql) into the input field on the upper left of this page:
https://studio.apollographql.com/sandbox/explorer

# Or use the integraded schema explorer (less features):
http://localhost:4000/graphql
```

### Basic docker commands:
#### Starting the Docker container:
In the project's main folder, you'll find a docker-compose.yml file that outlines the setup for the backend services. To run the docker container in your local environment, simply navigate to the root directory of the project and execute the following command:
```bash
docker compose up -d
```

#### Halting the Docker container:
To halt the container, simply execute:
```bash
docker compose stop
```

#### Deleting the Docker container:
To delete the container, including its associated volumes, enter:
```bash
docker compose down -v
```
