const express = require('express');
const constants = require('./constants');
const { TwitterApi } = require("twitter-api-v2");
const Twitter = require('./Twitter/Twitter');
const sessions = require('express-session');
var cors = require('cors');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const cookieParser = require('cookie-parser');
const path = require('path');

const { loggerPost, loggerTweet, loggerUser, loggerOpenAI } = require("./logger");
const { generateImage } = require("./OpenAI/OpenAI");
const { getTop10, getPosts, verifyUser, createPost, createUser, createTwitterAccount, getTwUserTokens, getScheduledPosts, deleteSchedule, updatePost } = require('./SQL/SQLite');
const { validateUser, validateEmail } = require('./validation');
const { generateAuthLinkTw, getUserTw, createTweet } = require('./Twitter/Twitter');
const { log } = require('winston');

const app = express();

var session;

const twitterAuthClient = new TwitterApi({
  clientId: constants.OAUTH2_ID,
  clientSecret: constants.OAUTH2_SECRET
});

// const twitterClient = new TwitterApi({
//   appKey: constants.CONSUMER_KEY,
//   appSecret: constants.CONSUMER_SECRET
// });

const oneDay = 1000 * 60 * 60;

const sqliteDB = new sqlite3.Database(__dirname + "/TG_Zanardi_Gleison.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQlite database.');
});


app.listen(process.env.PORT || constants.PORT, () => {
  console.log(`App is listening on port ${constants.PORT}`);
});

// middleware to serve images in assets, to call it, just use ip/<folder name>/<number>.png
app.use(express.static(__dirname + '/../../client/build'));
app.use("/assets", express.static(__dirname + '/OpenAI/assets/images'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());


// app.set('trust proxy', 1)


// app.use(cors({
//   origin: constants.REACT_SERVER,
//   methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
//   credentials: true
// }));

app.use(sessions({
  secret: constants.SESSION_SECRET,
  saveUninitialized: true,
  resave: false,
  cookie: {
    maxAge: oneDay,
    secure: "auto",
    httpOnly: false
  }
}));



// task execute on each 1 minute
setInterval(async () => {

  var currentdate = new Date().toLocaleString({ timeZone: 'America/Sao_Paulo' });
  console.log("Getting schedules at " + currentdate);
  let schedules = await getScheduledPosts(sqliteDB);

  schedules.forEach(async element => {
    let postDate = element.date;
    let scheduleDate = new Date(postDate).toLocaleString();
    console.log(`tweet scheduled to ${postDate} BEFORE`);
    console.log(`tweet scheduled to ${scheduleDate}`);
    if (scheduleDate <= currentdate) {
      console.log(`Creating tweet for schedule ${element.scheduleId}`);
      console.log(`tweet date: ${scheduleDate}, current date: ${currentdate}`);
      await createTweet(element.userId ,element.accessToken, element.refreshToken, element.postDescription, element.mediaUrl, sqliteDB)
        .then((result) => {
          // console.log(result);
          loggerTweet.notice(`tweet ${result.data.id} successfully created | scheduled`)
          console.log(`tweet ${result.data.id} successfully created`);
          updatePost(sqliteDB, result.data.id, element.postId);
        })
        .catch((err) => {
          loggerTweet.error(`error when creating tweet for post ${element.postId}`);
          console.log(`error when creating tweet for post ${element.postId}`);
          //console.log(err);
        })
    }
  });

}, 60000);





// /api routes

app.post("/api/register", async (req, res) => {

  if (!(validateEmail(req.body.email_register)) || !(validateUser(req.body.user_register))) {
    //console.log("erro");
    res.status(400).json({ message: 'Valores de entrada inválidos' });
  }

  let registerResult = await createUser(sqliteDB, req.body.email_register, req.body.user_register, req.body.password_register);

  if (registerResult == '1') {
    loggerUser.notice(`user ${req.body.user_register} created`);
    console.log(`user ${req.body.user_register} created`);
    //new token created
    let newToken = jwt.sign({ data: req.body.user_register }, constants.JWT_KEY, {
      expiresIn: 60 * 60
    });
    var tmpSession = req.session;
    tmpSession.user = req.body.user_register;
    return res.status(201).json({ auth: true, token: newToken });

    // 19 é o codigo de erro para o erro SQLITE_CONSTRAINT, que viola a UNIQUE constraint
  } else if (registerResult == '19') {
    loggerUser.info(`user ${req.body.user_register} or e-mail ${req.body.email_register} already in use`);
    return res.status(409).json({ auth: false, message: 'Usuário ou email já utilizados' });

  } else {
    loggerUser.error(`error on creating user ${req.body.user_register}`);
    return res.status(404).json({ message: 'Erro ao tentar criar usuário' });
  }
});


// Verify user credentials, creating a token in response
app.post("/api/login", async (req, res) => {

  if (!(validateUser(req.body.user_login))) {
    //console.log("erro");
    res.status(400).json({ message: 'Valores de entrada inválidos' });
  }

  let resultLogin = await verifyUser(sqliteDB, req.body.user_login, req.body.password_login);

  if (resultLogin == '1') {
    //new token created
    let newToken = jwt.sign({ data: req.body.user_login }, constants.JWT_KEY, {
      expiresIn: 60 * 60
    });

    loggerUser.notice(`user ${req.body.user_login} logged in`);

    var tmpSession = req.session;
    tmpSession.user = req.body.user_login;

    res.status(200).json({ auth: true, token: newToken });
  } else if (resultLogin == '0') {
    loggerUser.notice(`unsuccessful login for ${req.body.user_login}`);
    return res.status(401).json({ auth: false, message: 'Login Inválido' });
  } else {
    loggerUser.error(`error on login for user ${req.body.user_register}`);
    return res.status(404).json({ message: 'Erro ao fazer login' });
  }
});

app.post("/api/login/verify", (req, res) => {
  var verifying;
  // console.log('session id:');
  // console.log(req.sessionID);
  // console.log('session:');
  // console.log(req.session);
  try {
    // throws an error if the token is invalid
    verifying = jwt.verify(req.body.appToken, constants.JWT_KEY)
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).end("token expirado")
    }
    else if (error instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      return res.status(401).end("erro generico")
    }
    else {
      // otherwise, return a bad request error
      return res.status(400).end()
    }
  }
  return res.send(verifying)
});

app.post("/logout", (req, res) => {
  req.session.destroy();
  res.status(200).end();
});



app.post("/api/post/create", async (req, res) => {

  // console.log("req body --->");
  // console.log(req.body);

  let description = req.body.description;
  let twitter = req.body.twitter;

  let imgUrl = req.body.imgUrl;
  let schedule = req.body.schedule;

  let user = req.session.user;

  let resultUserTokens = await getTwUserTokens(sqliteDB, user);
  let resultToken = resultUserTokens.data;
  let numRows = resultUserTokens.numRows;

  if (numRows == '1') {
    let twAccessToken = resultToken[0].access_token;
    let refreshToken = resultToken[0].refresh_token;
    let userId = resultToken[0].user_id;
    // if statement to check if there is a schedule to the post

    let postResult = await createPost(sqliteDB, description, imgUrl, user, schedule, 'false');

    if (postResult.affectedRows != '1') {
      loggerPost.error(`error when creating post ${postResult.lastId}`);
      res.status(400).send('Error when creating post');
    }

    loggerPost.notice(`post ${postResult.lastId} created`);
    // res.status(200).send('Post created');

    if (schedule != 'false') {
      res.status(200).send('Post created');
    }
    else if (twitter) {
      await createTweet(userId, twAccessToken, refreshToken, description, imgUrl, sqliteDB)
        .then(async (result) => {

          loggerTweet.notice(`tweet ${result.data.id} successfully created`)
          console.log(`tweet ${result.data.id} successfully created`);
          await updatePost(sqliteDB, result.data.id, postResult.lastId);
          res.status(200).send('Post and tweet created');
        })
        .catch((err) => {
          loggerTweet.error(`error when creating tweet for post ${postResult.lastId}`);
          console.log(`error when creating tweet for post ${postResult.lastId}`);
          res.status(400).send('Error when creating tweet');
          //console.log(err);
        })
    }
  }
  else {
    // retorno para erro
    console.log("NUMROWS = " + numRows);
    res.status(400).send('Error when creating post')
  }
});


app.get("/api/sql/post/get", async (req, res) => {

  let user = req.session.user;
  let postsResult = await getPosts(sqliteDB, user);

  // console.log('Posts retrieved');
  res.status(200).send(postsResult);
});


app.get("/api/dalle/create", async (req, res) => {

  let prompt = req.query.prompt
  let user = req.session.user;
  let result = await generateImage(prompt, 2);

  if (result.name == 'Error') {
    loggerOpenAI.error(`unsuccessful prompt by ${user} | prompt: ${prompt}`);
    res.status(400).send(result.message);
  } else {
    loggerOpenAI.notice(`successfull prompt by ${user} | prompt: ${prompt} | result: ${result}`);
    res.status(200).send(result);
  }
});



/**
 *  Endpoint that send back a authentication url, storing the temporary tokens
 *  at the session
 */
app.get("/api/twitter/auth", async (req, res) => {

  let tmpTwitterAuthClient = new TwitterApi({
    clientId: constants.OAUTH2_ID,
    clientSecret: constants.OAUTH2_SECRET
  });

  var authLink = await generateAuthLinkTw(tmpTwitterAuthClient, req, res);
  console.log(authLink);
  // res.cookie('sessionID', req.sessionID, { maxAge: oneDay, httpOnly: true });
  res.status(200).send(authLink)

});

app.get("/api/auth", async (req, res) => {

  // function to remove items from the session
  // use it after using the tokens, to clean the session
  let removeAuthTokens = () => {
    delete tmpSession.codeVerifier;
    delete tmpSession.sessionState;
  }

  let tmpTwitterAuthClient = new TwitterApi({
    clientId: constants.OAUTH2_ID,
    clientSecret: constants.OAUTH2_SECRET
  });

  var tmpSession = req.session;

  let resultUserTw = await getUserTw(req, res);

  if (resultUserTw.result == '400') {
    // You denied the app or your session expired!
    tmpSession.twChanged = false;
    removeAuthTokens();
    res.redirect('/settings');
  }
  else if (resultUserTw.result == '403') {
    // Invalid verifier or access tokens!
    tmpSession.twChanged = false;
    removeAuthTokens();
    res.redirect('/settings');
  }
  else {
    let resultCreateAccount = await createTwitterAccount(sqliteDB, resultUserTw.userInfo.userID, resultUserTw.userInfo.screenName, resultUserTw.userInfo.accessToken, resultUserTw.userInfo.refreshToken, tmpSession.user)
    var sessionValue;
    if (resultCreateAccount == '1') {
      //new account created
      sessionValue = true;
    } else {
      sessionValue = false;
    }
    // if the account was changed, it will be stored in session
    removeAuthTokens();
    tmpSession.twChanged = sessionValue;
    loggerUser.notice(`user ${tmpSession.user} updated it's twitter account`)
    res.redirect('/settings');
  }
});


app.get("/api/test/session", (req, res) => {
  session = req.session;
  session.testeOne = 'teste1';
  console.log(session);
  console.log(req.session);
  res.send('ok')
});

app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "..", "client", "build", "index.html"));
});


// GET for testing database
// app.get("/test/sql", (req, res) => {
//   let callback = (result) => {
//     console.log(result);
//     res.send(result);
//   }
//   (async () => {
//     await getTop10(sqliteDB, callback)
//   })();
// });

// Set a default get return
// app.get('*', function (req, res) {
//   res.send('Sir, You tried to access: ' + req.url);
// });