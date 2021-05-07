# Basic layout for MVC with Express and backend user routes and controller. 

## Setup
### Development Enviroment:
Download the repository, 
```
npm install & npm run dev
```

### Production Enviroment
Download the repository, 
```
npm install & npm run start
```

## User Api: 
### 'api/user/...' (e.g 'api/user/register')

**/** A Get request that returns the current Authenticated User (See AuthToken Class).


**/register:** A post request that requires a json object with a user object that must at least have a password and email. Returns user object without the password. 
```
{
  "user": {
      "email": "John@Example.com",
      "password": "ExamplePassword",
      ...,
      ...
  }
}
``` 


**/login:** A post request that requires a json object with email and a password included. Returns user object without password
```
{
  "email": "John@Example.com",
  "password": "ExamplePassword"
}
```
**/logout:** A simple post request. Nothing required. Returns a a success

**/update** After authentication, a put request that requires a json object with password, key, and value included. Returns updated user
```
{
  "password": "a secure password",
  "key": "email"
  "value": "John@newemail.com"
}
```
or 
```
{
  "password": "old secure password",
  "key": "password"
  "value": "new secure password"
}
``` 

**/delete** After authentication, a delete request that requires a json object with a password. Returns a success message. 

```
{
  "password": "a secure password"
}
``` 
---
## authToken class

This class create a jsonwebtoken and places it in the 'auth-token' header after the user logs in. 
Including the auth-token the with request and using authToken.verify middleware in the route will make it secure.
If the user is unauthorized, the response will return a token error message. Note: currently the token expires after 24 hours, and the user will have to relogin. 

Example:
```
const authToken = require('./fileLocation/middleware/authToken');

router.get('/secureData', authToken.verify, (req, res) => {
  // SEND SECURE DATA HERE. 
});
```

Also, The AuthToken.verify will and add current users id to the req body (e.g req.body.id).

```
const authToken = require('./fileLocation/middleware/authToken');

router.get(/secureData, authToken.verify, (req, res) => {
  res.send(`User id: ${req.body.id}`);~
})
```
---

## Dependencies 

* Express (Handles HTTP requests and responses)
* bcrypt  (Handles password hashing)
* dotenv  (Allows the server to read .env files)
* jsonwebtoken (handles user authorization)
