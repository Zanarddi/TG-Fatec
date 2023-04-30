const constants = require('./src/constants');
const { TwitterApi } = require("twitter-api-v2");

// clientTwitter = new TwitterApi(constants.BEARER_TOKEN)
// rwClient = clientTwitter.readWrite;


// (async () => {
//   //const client = new TwitterApi('dmtmSWhzY0pSSTB4ZVc2YjMwZWs1WmFTVmlBVDBxZzFaVnVJNmtxc1Vvc1pMOjE2ODE1MzIyODU2ODE6MTowOmF0OjE');
//   const client = new TwitterApi({ clientId: constants.OAUTH2_ID, clientSecret: constants.OAUTH2_SECRET });

//   // Obtain the {refreshToken} from your DB/store
//   const { client: refreshedClient, accessToken, refreshToken: newRefreshToken } = await client.refreshOAuth2Token('aVplQmFrTXdVQzFoSm9obWYtMHAyamZONE9lRzlvZm9PbWliVFY3N21pNTNKOjE2ODE1MzM1NTg1MDI6MTowOnJ0OjE');
//   console.log(newRefreshToken);
//   console.log(accessToken);
//   console.log(refreshedClient);
//   // Store refreshed {accessToken} and {newRefreshToken} to replace the old ones

//   // Example request
//   await refreshedClient.v2.me();
// })();

// (async () => {
//   const client = new TwitterApi('UGNLYml0RllKbzlOSDU5QlpMZmpjamxYdXFfVV9iaEhHRGtxTjc5ZHJsMFhhOjE2ODE2NjA5ODM2Nzk6MTowOmF0OjE');
//   // const { data: createdTweet } = await client.readWrite.v2.tweet('twitter-api-v2 is awesome!', {
//   //   poll: { duration_minutes: 120, options: ['Absolutely', 'For sure!'] },
//   // });
//   // console.log('Tweet', createdTweet.id, ':', createdTweet.text);
//   console.log('CLIENT BEFORE');
//   console.log(client);
//   console.log('END 1');
//   await client.v2.tweet('testes');
//   console.log('CLIENT AFTER');
// })();


// (async () => {
//   const v1client = new TwitterApi({
//     appKey: constants.APP_KEY,
//     appSecret: constants.APP_SECRET,
//     accessToken: process.env.ACCESS_TOKEN,
//     accessSecret: process.env.ACCESS_SECRET,
//   });


//   let mediaId = await v1client.v1.uploadMedia(__dirname + '/../OpenAI/assets/images' + imgUrl);
//   console.log('Image added --> ' + mediaId);
// })();

try {
  twitterClient = new TwitterApi(
    {
      appKey: constants.APP_KEY,
      appSecret: constants.APP_SECRET,
      accessToken: constants.ACCESS_TOKEN,
      accessSecret: constants.ACCESS_SECRET
    })
  const mediaId = await twitterClient.v1.uploadMedia("./image.png");
  await twitterClient.v2.tweet({
    text: "Hello world! This is an image in Ukraine!",
    media: {
      media_ids: [mediaId]
    }
  });
} catch (e) {
  console.log(e)
}
