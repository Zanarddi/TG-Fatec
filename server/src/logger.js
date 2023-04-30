const { createLogger, format, transports, config } = require('winston');
const { combine, timestamp, json } = format;

// To use logger:
// const logger = require('./logger')
// logger.error('Unable to find user')


// new transports.File({ filename: './logs/warning.log', level: 'warning' }),

// levels: {
//     emerg: 0,
//     alert: 1,
//     crit: 2,
//     error: 3,
//     warning: 4,
//     notice: 5,
//     info: 6,
//     debug: 7
// }

let logFolder = `${__dirname}/logs`;

exports.loggerPost = createLogger({
    levels: {
        emerg: 0,
        alert: 1,
        crit: 2,
        error: 3,
        warning: 4,
        notice: 5,
        info: 6,
        debug: 7
    },
    // defaultMeta: { component: 'user-service' },
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        json()
    ),
    transports: [
        // new transports.Console(),
        new transports.File({ filename: `${logFolder}/post.log`})
    ]
});

exports.loggerTweet = createLogger({
    levels: {
        emerg: 0,
        alert: 1,
        crit: 2,
        error: 3,
        warning: 4,
        notice: 5,
        info: 6,
        debug: 7
    },
    // defaultMeta: { component: 'user-service' },
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        json()
    ),
    transports: [
        // new transports.Console(),
        new transports.File({ filename: `${logFolder}/tweet.log` })
    ]
});

exports.loggerUser = createLogger({
    levels: {
        emerg: 0,
        alert: 1,
        crit: 2,
        error: 3,
        warning: 4,
        notice: 5,
        info: 6,
        debug: 7
    },
    // defaultMeta: { component: 'user-service' },
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        json()
    ),
    transports: [
        // new transports.Console(),
        new transports.File({ filename: `${logFolder}/user.log` })
    ]
});

exports.loggerOpenAI = createLogger({
    levels: {
        emerg: 0,
        alert: 1,
        crit: 2,
        error: 3,
        warning: 4,
        notice: 5,
        info: 6,
        debug: 7
    },
    // defaultMeta: { component: 'user-service' },
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        json()
    ),
    transports: [
        // new transports.Console(),
        new transports.File({ filename: `${logFolder}/openai.log` })
    ]
});