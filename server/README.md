# TG - Backend

To run this project, it is important to use the front part of the project.
<br>
[Frontend.](https://github.com/Zanarddi/TG-Fatec-Front)

## Installation

Use the package manager [npm](https://www.npmjs.com) to install dependencies.

```js
npm install
```

<br>

It is necessary to include some data in the appsettings.json.example file, adding the following values:
<br>
  "PORT": The server port where the api will work
  <br>
  "BEARER_TOKEN": Value avaliable from twitter developer account's api
  <br>
  "APP_KEY": Value avaliable from twitter developer account's api
  <br>
  "APP_SECRET": Value avaliable from twitter developer account's api
  <br>
  "OAUTH2_ID": Value avaliable from twitter developer account's api
  <br>
  "OAUTH2_SECRET": Value avaliable from twitter developer account's api
  <br>
  "ACCESS_TOKEN": Value avaliable from twitter developer account's api
  <br>
  "ACCESS_SECRET": Value avaliable from twitter developer account's api
  <br>
  "CALLBACK_URL": Value setted in twitter developer account's api
  <br>
  "REACT_SERVER": Url to the front end server
  <br>
  "JWT_KEY": Random key used for security purposes
  <br>
  "SESSION_SECRET": Random key used for session security
  <br>
  "OPENAI_KEY": Value avaliable from OpenAI developer account's api
  <br>
  "OPENAI_ORG": Value avaliable from OpenAI developer account's api
  <br>

<br>

After that, just rename the file from appsettings.json.example to appsettings.json
<br>
<br>
Run "npm start" to start the server
