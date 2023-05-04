require('dotenv').config({ path: __dirname + '/./../.env' }) //path relative to this folder
const config = require('./../appsettings.json');

// // environment constants, used in other files
// module.exports = Object.freeze({
//     PORT: process.env.PORT,
//     CONSUMER_KEY: process.env.CONSUMER_KEY,
//     CONSUMER_SECRET: process.env.CONSUMER_SECRET,
//     CALLBACK_URL: process.env.CALLBACK_URL,
//     REACT_SERVER: process.env.REACT_SERVER,
//     JWT_KEY: process.env.JWT_KEY,
//     SESSION_SECRET: process.env.SESSION_SECRET,
//     OPENAI_KEY: process.env.OPENAI_KEY,
//     OPENAI_ORG: process.env.OPENAI_ORG
// })


// environment constants, used in other files
module.exports = Object.freeze({
    PORT: config.PORT,
    BEARER_TOKEN: config.BEARER_TOKEN,
    APP_KEY: config.APP_KEY,
    APP_SECRET: config.APP_SECRET,
    OAUTH2_ID: config.OAUTH2_ID,
    OAUTH2_SECRET: config.OAUTH2_SECRET,
    ACCESS_TOKEN: config.ACCESS_TOKEN,
    ACCESS_SECRET: config.ACCESS_SECRET,
    CALLBACK_URL2: config.CALLBACK_URL2,
    REACT_SERVER2: config.REACT_SERVER2,
    CALLBACK_URL: config.CALLBACK_URL,
    REACT_SERVER: config.REACT_SERVER,
    JWT_KEY: config.JWT_KEY,
    SESSION_SECRET: config.SESSION_SECRET,
    OPENAI_KEY: config.OPENAI_KEY,
    OPENAI_ORG: config.OPENAI_ORG,
    GMAIL_ACCOUNT: config.GMAIL_ACCOUNT,
    GMAIL_PASSWORD: config.GMAIL_PASSWORD
})