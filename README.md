[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=15442489&assignment_repo_type=AssignmentRepo)

# P2-Challenge-1 (Server Side)

> Tuliskan API Docs kamu di sini

# News API Documentation

Link: https://server.fathanjundirabbani.my.id/

## Endpoints:

List of Available Endpoints:

**Login**

- `POST /login`

**Public**

- `GET /pub/articles`
- `GET /pub/articles/:id`

**Article**

- `GET /articles`
- `POST /articles`
- `GET /articles/:id`
- `PUT /articles/:id`
- `DELETE /articles/:id`
- `PATCH /articles/:id`

**Category**

- `GET /categories`
- `POST /categories`
- `PUT /categories/:id`

**Add User**

- `POST /add-user`
  &nbsp;

# 1. POST /login

Request:

- Body:

```json
{
  "email": "string",
  "password": "string"
}
```

_Response (200 - Ok)_

```json
{
  "access_token": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Please input email or password";
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid email or password";
}
```

# 2. GET /pub/articles

Request:

- Body:

```json

```

&nbsp;

# 3. GET /pub/articles/:id

&nbsp;

# 4. GET /articles

&nbsp;

# 5. POST /articles

Request:

- body:

```json
{
  "title": "string",
  "content": "text",
  "imgUrl": "string",
  "categoryId": "integer"
}
```

_Response (201 - Created)_

```json
{
  "message": "Success Create New Article",
  "articles": {
    "title": "string",
    "content": "text",
    "imgUrl": "string",
    "categoryId": "integer",
    "userId": "integer"
  }
}
```

_Response (401 - Unauthorized)_

```json
{
  "message" = "Please login first";
}
OR
{
  "message" = "Invalid email or password";
}
```

&nbsp;
