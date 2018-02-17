# API Documentation

## GraphQL

Most actual user data is behind the GraphQL endpoint. Requires the Authorization header with the
JWT provided from the auth endpoints. This API can be exposed to not require authorization by
running the server with the `--open` flag.

Query:
```
GET /api/v2?query=<GraphQL string>
Authorization: Bearer <JWT>
```

Mutation:
```
POST /api/v2
Authorization: Bearer <JWT>
Body:
{
  "query": "<GraphQL string>"
}
```

## Authorization

Sign in a new user
```
POST /api/auth
Body:
{
  "usr": "<email>",
  "psw": "<password>"
}
===================================
{
  "status": "Success|Failure",
  "data": "<JWT>",
  "error": null | "Error message"
}
```

Reauthorize an existing user:
```
GET /api/auth
Authorization: Bearer <JWT>
===================================
{
  "status": "Success|Failure",
  "data": "<JWT>",
  "error": null | "Error message"
}
```

## Sign Up

Check if an email is already in use:
```
GET /api/account/exists/<email>
===================================
{
  "status": "Success|Failure",
  "data": true | false,
  "error": null | "Error message"
}
```

Create a new account:
```
POST /api/account/new

{
  "email": "<email>",
  "name": "<name>",
  "password": "<password>"
}
===================================
{
  "status": "Success|Failure",
  "data": null,
  "error": null | "Error message"
}
```
