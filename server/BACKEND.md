# API Testing Tool - Backend API Documentation

## Project Overview

This backend powers the **API Testing Tool**, a web application that allows users to send HTTP requests, inspect responses, save API collections, and manage request history.

---

# Base URL

### Development

```
http://localhost:5000/api
```

### Production

```
https://your-domain.com/api
```

---

# Authentication

Most endpoints require JWT Authentication.

Send the token in the Authorization header.

```
Authorization: Bearer <JWT_TOKEN>
```

---

# Common Response Format

## Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

## Error

```json
{
  "success": false,
  "message": "Something went wrong"
}
```

---

# Authentication APIs

---

## Register User

### POST

```
/auth/register
```

### Request Body

```json
{
  "name": "Animesh",
  "email": "animesh@gmail.com",
  "password": "12345678"
}
```

### Success Response

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "JWT_TOKEN"
}
```

---

## Login User

### POST

```
/auth/login
```

### Request Body

```json
{
  "email": "animesh@gmail.com",
  "password": "12345678"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Login successful",
  "token": "JWT_TOKEN",
  "user": {
    "_id": "6878a4...",
    "name": "Animesh",
    "email": "animesh@gmail.com"
  }
}
```

---

## Logout User

### POST

```
/auth/logout
```

### Body

No request body required.

### Success Response

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

# API Request Module

This module is responsible for sending API requests to external services.

---

## Send API Request

### POST

```
/request/send
```

### Description

Sends GET, POST, PUT, DELETE, or PATCH requests to any REST API.

---

### Request Body

```json
{
  "method": "GET",
  "url": "https://jsonplaceholder.typicode.com/posts",

  "headers": {
    "Content-Type": "application/json"
  },

  "body": {},

  "auth": {
    "type": "Bearer",
    "token": "YOUR_TOKEN"
  }
}
```

---

### Supported Methods

```
GET
POST
PUT
PATCH
DELETE
```

---

### Supported Authentication

```
None
Bearer
API_KEY
```

---

### Success Response

```json
{
  "success": true,
  "data": {
    "status": 200,
    "statusText": "OK",

    "responseTime": 142,

    "headers": {
      "content-type": "application/json"
    },

    "body": [
      {
        "id": 1,
        "title": "Sample Title"
      }
    ]
  }
}
```

---

### Error Response

```json
{
  "success": false,
  "message": "Network Error"
}
```

---

# Request History Module

Stores every API request sent by the user.

---

## Get Request History

### GET

```
/history
```

### Authentication

Required

### Success Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "6878aa...",
      "method": "GET",
      "url": "https://jsonplaceholder.typicode.com/posts",
      "createdAt": "2026-07-14T12:30:45Z"
    }
  ]
}
```

---

## Delete One History Item

### DELETE

```
/history/:historyId
```

### Authentication

Required

---

## Delete Complete History

### DELETE

```
/history
```

### Authentication

Required

---

# Collections Module

Collections are folders used to organize API requests.

Example

```
User APIs

Authentication APIs

Payment APIs

Testing APIs
```

---

## Create Collection

### POST

```
/collections
```

### Body

```json
{
  "name": "User APIs"
}
```

---

## Get All Collections

### GET

```
/collections
```

---

## Get Single Collection

### GET

```
/collections/:collectionId
```

---

## Update Collection

### PUT

```
/collections/:collectionId
```

### Body

```json
{
  "name": "Updated Collection Name"
}
```

---

## Delete Collection

### DELETE

```
/collections/:collectionId
```

---

# Saved Requests Module

Each collection can contain multiple saved requests.

---

## Save Request Inside Collection

### POST

```
/collections/:collectionId/request
```

### Body

```json
{
  "name": "Get All Users",

  "method": "GET",

  "url": "https://jsonplaceholder.typicode.com/users",

  "headers": {
    "Content-Type": "application/json"
  },

  "body": {},

  "auth": {
    "type": "Bearer",
    "token": ""
  }
}
```

---

## Get All Saved Requests

### GET

```
/collections/:collectionId/request
```

---

## Get Single Saved Request

### GET

```
/request/:requestId
```

---

## Update Saved Request

### PUT

```
/request/:requestId
```

### Body

```json
{
  "name": "Updated Request",

  "method": "POST",

  "url": "https://api.example.com/users",

  "headers": {
    "Content-Type": "application/json"
  },

  "body": {
    "name": "John"
  },

  "auth": {
    "type": "Bearer",
    "token": "TOKEN"
  }
}
```

---

## Delete Saved Request

### DELETE

```
/request/:requestId
```

---

# User Profile Module

---

## Get Profile

### GET

```
/user/profile
```

---

## Update Profile

### PUT

```
/user/profile
```

### Body

```json
{
  "name": "Animesh",
  "profileImage": "image_url"
}
```

---

# HTTP Status Codes

| Status Code | Meaning               |
| ----------- | --------------------- |
| 200         | Success               |
| 201         | Created Successfully  |
| 400         | Bad Request           |
| 401         | Unauthorized          |
| 403         | Forbidden             |
| 404         | Not Found             |
| 500         | Internal Server Error |

---

# Folder Structure

```
backend/
│
├── controllers/
│   ├── auth.controller.js
│   ├── request.controller.js
│   ├── history.controller.js
│   ├── collection.controller.js
│   ├── savedRequest.controller.js
│   └── user.controller.js
│
├── models/
│   ├── User.js
│   ├── History.js
│   ├── Collection.js
│   └── SavedRequest.js
│
├── routes/
│   ├── auth.routes.js
│   ├── request.routes.js
│   ├── history.routes.js
│   ├── collection.routes.js
│   └── user.routes.js
│
├── middlewares/
│   ├── auth.middleware.js
│   └── error.middleware.js
│
├── utils/
│   └── axiosClient.js
│
├── config/
│   └── db.js
│
├── app.js
├── server.js
└── package.json
```

---

# Frontend Integration Notes

## Base URL

```
http://localhost:5000/api
```

---

## Content Type

Always send

```
Content-Type: application/json
```

---

## JWT Header

For protected routes

```
Authorization: Bearer <JWT_TOKEN>
```

---

## Headers Object Format

```json
{
  "Content-Type": "application/json",
  "Accept": "*/*"
}
```

---

## Request Body Format

```json
{
  "name": "John"
}
```

---

## Authentication Object

Bearer Token

```json
{
  "type": "Bearer",
  "token": "JWT_TOKEN"
}
```

API Key

```json
{
  "type": "API_KEY",
  "key": "x-api-key",
  "value": "YOUR_API_KEY"
}
```

No Authentication

```json
{
  "type": "None"
}
```

---

# Frontend Guidelines

* Validate JSON before sending requests.
* Pretty print JSON responses.
* Display response status.
* Display response headers.
* Display response time.
* Display response size.
* Store JWT after login.
* Show loading indicator while request is being processed.
* Use toast notifications for success and failure.
* Clicking a history item should automatically populate the request editor.
* Clicking a saved request should load it into the request builder.

---

# Future Enhancements

The backend has been designed to support future features including:

* AI Request Suggestions
* AI Error Explanation
* AI Generated Headers
* AI Generated Request Body
* AI Generated Test Cases
* API Documentation Generator
* Environment Variables (Development, Staging, Production)
* Import / Export Collections
* GraphQL Support
* WebSocket Testing
* Request Code Generation (cURL, JavaScript, Python, Java, C#)
* Team Workspaces
* Request Scheduling
* API Performance Analytics

---

# Developed Modules

* User Authentication (JWT)
* API Request Engine
* Dynamic Headers
* Request Body Support
* Authentication Support (Bearer/API Key)
* Request History
* API Collections
* Saved Requests
* User Profile
* Response Viewer
* JSON Formatter Support
