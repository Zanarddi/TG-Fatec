const { TwitterApi } = require("twitter-api-v2");
const constants = require('./../constants');
const cookieParser = require('cookie-parser');
const { updateTwitterAccount } = require('./../SQL/SQLite');

const oneDay = 1000 * 60 * 60;
const { log } = require("winston");
const { CONSTRAINT } = require("sqlite3");

const v1client = new TwitterApi({
  appKey: constants.APP_KEY,
  appSecret: constants.APP_SECRET,
  accessToken: constants.ACCESS_TOKEN,
  accessSecret: constants.ACCESS_SECRET
});

exports.generateAuthLinkTw = async function (twitterAuthClient, req, res) {

  const { url, codeVerifier, state } = await twitterAuthClient.generateOAuth2AuthLink(constants.CALLBACK_URL, { scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'] });

  var session = req.session;
  session.codeVerifier = codeVerifier;
  session.sessionState = state;

  return url;
}

exports.getUserTw = async function (req, res) {

  console.log(`query bellow`);
  console.log(req.query);
  console.log(`session bellow`);
  console.log(req.session);
  // Extract state and code from query string
  const { state, code } = req.query;
  // Get the saved codeVerifier from session
  const { codeVerifier, sessionState } = req.session;

  return new Promise(async (resolve, reject) => {
    if (!codeVerifier || !state || !sessionState || !code) {
      resolve({ result: '400', userInfo: null });
      return;
    }
    if (state !== sessionState) {
      console.error('Stored tokens didnt match!');
      resolve({ result: '400', userInfo: null });
      return;
    }

    // Obtain access token
    let client = new TwitterApi({ clientId: constants.OAUTH2_ID, clientSecret: constants.OAUTH2_SECRET });

    await client.loginWithOAuth2({ code, codeVerifier, redirectUri: constants.CALLBACK_URL })
      .then(async ({ client: loggedClient, accessToken, refreshToken, expiresIn }) => {

        // {loggedClient} is an authenticated client in behalf of some user
        // Store {accessToken} somewhere, it will be valid until {expiresIn} is hit.
        // If you want to refresh your token later, store {refreshToken} (it is present if 'offline.access' has been given as scope)

        // console.log('LOGGED CLIENT BELLOW');
        // console.log(loggedClient);
        // console.log('ACCESS TOKEN BELLOW');
        // console.log(accessToken);
        // console.log('REFRESH TOKEN BELLOW');
        // console.log(refreshToken);
        // console.log('EXPIRES IN BELLOW');
        // console.log(expiresIn);

        var userObject = [];

        await loggedClient.v2.me().then((result) => {
          userObject = result;
        });
        // console.log('USER OBJECT BELLOW');
        // console.log(userObject);
        resolve({
          result: '200', userInfo: {
            userID: userObject.data.id,
            screenName: userObject.data.username,
            accessToken: accessToken,
            refreshToken: refreshToken
          }
        });
        return;
      })
      .catch((err) => {
        console.error(err);
        resolve({ result: '403', userInfo: null });
        return;
      });
  });
}


const refreshTwToken = async (refreshToken) => {
  let client = new TwitterApi({ clientId: constants.OAUTH2_ID, clientSecret: constants.OAUTH2_SECRET });
  //const { client: refreshedClient, accessToken, refreshToken: newRefreshToken } = await client.refreshOAuth2Token(refreshToken);
  const { client: refreshedClient, accessToken, refreshToken: newRefreshToken } = await client.refreshOAuth2Token(refreshToken)
    .catch((err) => {
      console.log(err);
    });
  //console.log(refreshedClient);
  return {
    client: refreshedClient,
    newAccessToken: accessToken,
    newRefreshToken: newRefreshToken
  }
}


exports.createTweet = async function (userId, twAccessToken, refreshToken, description, imgUrl, sqliteDB) {
  let newUser = await refreshTwToken(refreshToken);
  // console.log(`newUser bellow -->`);
  // console.log(newUser);
  // console.log(newUser.client);
  // console.log(newUser.newAccessToken);
  // console.log(newUser.newRefreshToken);
  let result = await updateTwitterAccount(sqliteDB, twAccessToken, newUser.newAccessToken, newUser.newRefreshToken);

  if (result) {
    let tmpClient = newUser.client;
    if (imgUrl != '' && imgUrl != 'false') {
      // make tweet with image
      // console.log('trying to add image');
      let mediaId = await v1client.v1.uploadMedia(__dirname + '/../OpenAI/assets/images' + imgUrl, { additionalOwners: userId });
      // console.log('Image added --> ' + mediaId);
      console.log(mediaId);
      return await tmpClient.v2.tweet({
        text: description,
        media: {
          media_ids: [mediaId]
        }
      })
        .then((data) => {
          // console.log("RESULTADO DA CRIAÇÃO DO TWEET");
          // console.log(data);
          return data;
        }).catch((err) => {
          console.error(err);
        });
    }
    else {
      // make tweet without media
      return await tmpClient.v2.tweet(description).then((data) => {
        // console.log(`TWEET CREATED BELLOW`);
        // console.log(data);
        return data
      })
    }
  }
  else {
    console.error(`Error when trying to update twitter account`);
  }

}