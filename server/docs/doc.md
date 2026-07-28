# APIHUB - Complete Knowledge Base

---

# Overview

APIHUB is a browser-based API Testing Platform similar to Postman.

It enables developers to send HTTP requests, inspect responses, organize APIs into collections, maintain request history, authenticate requests, and manage API testing from a modern dashboard.

The platform is designed for developers, students, testers, and backend engineers.

---

# Main Features

APIHUB provides the following core features:

- User Authentication
- Google Login
- Email Verification
- Two Factor Authentication (2FA)
- API Request Builder
- Response Viewer
- Collections
- Saved Requests
- Request History
- User Profile
- Dashboard Statistics
- Theme Switching

---

# Authentication

Users can create an account using:

- Email and Password
- Google Sign In

Google users are automatically verified.

Email users must verify their email before they are considered verified users.

A verified user has a green verification badge displayed in the profile.

---

# Email Verification

After registration the user can press **Verify Email**.

The system sends a 6-digit OTP to the registered email address.

The user enters the OTP.

If the OTP matches and has not expired:

- User becomes verified
- Green verification badge appears
- Verification OTP is removed from database

OTP validity:

10 minutes

---

# Login

Users login using:

Email

Password

If credentials are incorrect:

The system shows an Invalid Credentials message.

If email is not verified:

The system asks the user to verify email first.

If credentials are correct:

A Login OTP is generated.

The OTP is emailed to the user.

The user is redirected to the OTP Verification screen.

Only after entering the correct OTP does the user enter the dashboard.

---

# Login OTP (2FA)

Every login requires a 6-digit OTP.

Workflow:

Login

↓

Email OTP Generated

↓

OTP Verification Page

↓

Verify OTP

↓

Dashboard

OTP expires after 10 minutes.

---

# Google Login

Users can login using Google.

Google authentication automatically creates an account if it does not already exist.

Google accounts are automatically marked as verified.

Google login does not require email verification.

---

# Dashboard

The Dashboard is the main workspace.

It contains:

- Request Builder
- Response Viewer
- Collections
- History
- Profile
- Settings

---

# Request Builder

Users can create API requests.

Supported HTTP methods:

- GET
- POST
- PUT
- PATCH
- DELETE
- OPTIONS
- HEAD

Users can configure:

- URL
- Headers
- Query Parameters
- Request Body
- Authorization

---

# Headers

Users can add unlimited headers.

Example

Content-Type

application/json

Authorization

Bearer token

Accept

application/json

Headers are sent exactly as configured.

---

# Query Parameters

Users can add unlimited query parameters.

Example

```
?page=1&limit=20
```

Parameters are automatically appended to the request URL.

---

# Request Body

Supports

Raw JSON

Example

```json
{
    "name":"John",
    "age":20
}
```

---

# Authorization

Supported authentication methods

No Auth

Bearer Token

API Key

Basic Authentication

---

# Sending Requests

When user clicks Send

The request is sent through the backend proxy server.

Backend performs the request.

Response is returned to frontend.

The browser never directly contacts third-party APIs.

Advantages

- Avoids CORS issues
- Secure
- Supports all APIs

---

# Response Viewer

Displays

Status Code

Status Text

Response Time

Headers

JSON Response

Formatted Response

---

# Collections

Collections are folders.

Users can create unlimited collections.

Example

```
My APIs

User APIs

Testing APIs

Production APIs

College Project

```

Each collection can contain multiple saved requests.

---

# Saved Requests

Each request can be saved inside any collection.

Saved request stores

Method

URL

Headers

Query Parameters

Body

Authorization

Users can

Create

Open

Edit

Delete

Saved requests

---

# History

Every request is automatically stored.

History stores

Method

URL

Status Code

Time

Date

Response Time

Users can

Open history

Delete one item

Clear entire history

---

# Profile

Users can

Update name

Update avatar

View email

View account status

View verification badge

Logout

---

# Dashboard Statistics

Dashboard displays

Total Requests

Successful Requests

Failed Requests

Collections Count

Saved Requests Count

---

# Themes

Supports

Light Theme

Dark Theme

Theme preference is saved automatically.

---

# Supported HTTP Methods

GET

POST

PUT

PATCH

DELETE

OPTIONS

HEAD

---

# Common Questions

## How do I create an account?

Open Signup page.

Enter Name, Email and Password.

Click Signup.

Verify your email.

Login.

---

## How do I verify my email?

Login.

Go to Profile.

Click Verify Email.

Enter the OTP sent to your email.

Click Verify.

---

## Why am I not verified?

Possible reasons

- OTP expired
- Wrong OTP
- OTP not requested
- Already verified

---

## Why can't I login?

Possible reasons

Wrong password

Wrong email

Email not verified

Incorrect Login OTP

Expired Login OTP

---

## How do I send a POST request?

Open Dashboard.

Select POST.

Enter URL.

Add JSON body.

Click Send.

---

## How do I use Bearer Token?

Select Authorization.

Choose Bearer Token.

Paste your token.

Send request.

---

## How do I create a collection?

Open Collections.

Click New Collection.

Enter a name.

Save.

---

## How do I save a request?

Create the request.

Click Save.

Choose a collection.

Enter request name.

Save.

---

## How do I delete history?

Open History.

Click Delete beside an item.

Or

Click Clear History.

---

## What is a collection?

A collection is a folder used to organize multiple API requests.

---

## What is request history?

History automatically stores every request sent by the user.

---

## What does the green badge mean?

The green badge indicates that the user's email has been successfully verified.

---

# AI Assistant Rules

The AI assistant should answer only questions related to APIHUB.

It should explain:

- Features
- API testing
- Authentication
- Collections
- History
- Profile
- Dashboard
- Request Builder
- Authorization
- Email Verification
- Login OTP
- Settings

If the user asks anything unrelated to APIHUB, the assistant should reply:

> Sorry, I can only answer questions related to APIHUB and its features.

The AI should never invent features that do not exist.

The AI should always provide short, step-by-step answers.

The AI should avoid technical implementation details unless explicitly asked.
