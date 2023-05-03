const sqlite3 = require('sqlite3').verbose();

/**
 * Test only function
 * @param sqliteDB - sqlite database, used to get data.
 * @param callback - fucntion called after execution 
 */
exports.getTop10 = async function (sqliteDB, callback) {
  var data = [];

  // var query = 'create table schedule(id INTEGER PRIMARY KEY AUTOINCREMENT, schedule_date varchar (30) not null, post_id INTEGER not null references post(post_id))'
  //var query = 'create table post(post_id INTEGER PRIMARY KEY AUTOINCREMENT, post_description varchar not null, media_url varchar (50), tweet_id varchar (20), schedule varchar, app_user varchar (30) not null references app_user(username))'
  //var query = 'SELECT access_token, access_secret FROM tw_user tw JOIN app_user app ON app.tw_id = tw.user_id WHERE app.username = "teste"'
  //var query = 'create table tweet(tweet_id varchar (20) primary key,tw_id varchar (20) not null references tw_user(user_id),media_url varchar (50))';
  //var query = 'DROP TABLE schedule';
  //var query = 'DELETE FROM schedule WHERE id = 15';
  //var query = 'ALTER TABLE tw_user RENAME COLUMN access_secret to refresh_token;';
  //var query = 'SELECT * FROM tw_user';
  //var query = "UPDATE post SET post_description = 'new post for sure' WHERE post_id = 42"
  var query = 'SELECT teste'
  sqliteDB.each(query,
    // callback that runs for each row
    (err, row) => {
      data.push(row);
    },
    // callback that runs after completion
    (err, numRows) => {
      // console.log(numRows);
      err ? callback(err) : callback(data)
    })
};

exports.getPosts = async function (sqliteDB, user) {

  let data = [];
  let query = `SELECT * FROM post WHERE app_user = '${user}'`;

  return new Promise(async (resolve, reject) => {
    sqliteDB.each(query,
      // callback that runs for each row
      (err, row) => {
        data.push(row);
      },
      // callback that runs after completion
      (err, numRows) => {
        if (err) {
          resolve(err);
        }
        resolve(data);
      })
  });
};


// Check email
exports.verifyEmail = async function (sqliteDB, email) {
  let data = [];
  let query = `SELECT * FROM app_user WHERE email = '${email}'`;
  return new Promise(async (resolve, reject) => {
    sqliteDB.each(query,
      // callback that runs for each row
      (err, row) => {
        data.push(row);
      },
      // callback that runs after completion
      (err, numRows) => {
        if (err) {
          resolve(err);
        }
        resolve(numRows);
      })
  });
};

// Creates password reset token
exports.createResetToken = async function (sqliteDB, email, token, expirationDate) {

  let query = `INSERT OR REPLACE INTO pwd_reset (email, token, expiration) VALUES ('${email}', '${token}', '${expirationDate}')`;

  return new Promise(async (resolve, reject) => {
    sqliteDB.run(query, [],
      function (err) {
        if (err) {
          resolve(err.errno);
        }
        // there is a this.lastId avaliable to be used in his function context
        var affectedRows = this.changes;
        resolve(affectedRows);
      }
    )
  });
};



// Check user credentials
exports.verifyUser = async function (sqliteDB, user, password) {

  let data = [];
  let query = `SELECT * FROM app_user WHERE username = '${user}' AND str_password = '${password}'`;

  return new Promise(async (resolve, reject) => {
    sqliteDB.each(query,
      // callback that runs for each row
      (err, row) => {
        data.push(row);
      },
      // callback that runs after completion
      (err, numRows) => {
        if (err) {
          resolve(err);
        }
        resolve(numRows);
      })
  });
};


exports.createUser = async function (sqliteDB, email, user, password) {
  // register new user
  let query = `INSERT INTO app_user (username, email, str_password)VALUES ('${user}', '${email}', '${password}')`;

  return new Promise(async (resolve, reject) => {
    sqliteDB.run(query, [],
      function (err) {
        if (err) {
          // console.log('erro --> '+ err.code);
          // console.log('mensagem --> ' + err.message);
          resolve(err.errno);
        }
        // there is a this.lastId avaliable to be used in his function context
        var affectedRows = this.changes;
        if (affectedRows == '1') {
          resolve(affectedRows);
        }
      }
    )
  });
};

exports.verifyTwtiterUser = async function (sqliteDB, callback, user, password) {

  let data = [];
  let query = `SELECT * FROM app_user WHERE username = '${user}' AND str_password = '${password}'`;

  sqliteDB.each(query,
    // callback that runs for each row
    (err, row) => {
      data.push(row);
    },
    // callback that runs after completion
    (err, numRows) => {
      if (err) {
        callback(err);
      }
      callback(numRows);
    })
};

exports.getTwUserTokens = async function (sqliteDB, user) {
  let data = [];
  let query = `SELECT access_token, refresh_token, user_id FROM tw_user tw JOIN app_user app ON app.tw_id = tw.user_id WHERE app.username = '${user}'`;

  return new Promise(async (resolve, reject) => {
    sqliteDB.each(query,

      (err, row) => {
        data.push(row);
      },

      (err, numRows) => {
        if (err) {
          console.log(err);
        }
        // console.log(`numRows --> ${numRows}`);
        resolve({ data: data, numRows: numRows });
      }
    )
  });
};

exports.updateTwitterAccount = async function (sqliteDB, accessToken, newAccessToken, newRefreshToken) {
  let results = false
  let query =
    `UPDATE tw_user SET access_token = '${newAccessToken}',
  refresh_token = '${newRefreshToken}'
  WHERE access_token = '${accessToken}'`;
  // this function returns a promise, so that when updating the account, we can await for the result properly
  return new Promise(async (resolve, reject) => {
    await sqliteDB.run(query, [],
      function (err) {
        if (err) {
          console.log('erro --> ' + err.code);
          console.log('mensagem --> ' + err.message);
          console.error(err);
          //callback(false);
          results = false;
        }
        // there is a this.lastId avaliable to be used in his function context
        var affectedRows = this.changes;
        // console.log(`Affected rows --> ${affectedRows}`);
        if (affectedRows == '1') {
          //callback(true);
          // console.log(`afffected rows ${affectedRows}`);
          results = true;
        }
        resolve(results);
      }
    );
  })
}


exports.createTwitterAccount = async function (sqliteDB, userID, screeName, accessToken, refreshToken, appUser) {
  // register new user
  let query = `INSERT OR REPLACE INTO tw_user (user_id, screen_name, access_token, refresh_token)VALUES ('${userID}', '${screeName}', '${accessToken}', '${refreshToken}')`;

  return new Promise(async (resolve, reject) => {
    sqliteDB.run(query, [],
      function (err) {
        if (err) {
          console.log('erro --> ' + err.code);
          console.log('mensagem --> ' + err.message);
          // console.log(err);
          (async () => {
            await updateAppUserTw(sqliteDB, userID, appUser).then(resolve(err.errno));
          })();
        }
        // there is a this.lastId avaliable to be used in his function context
        var affectedRows = this.changes;
        if (affectedRows == '1') {
          (async () => {
            await updateAppUserTw(sqliteDB, userID, appUser).then(resolve(affectedRows))
          })();
        }
      }
    )
  });
};

exports.createPost = async function (sqliteDB, description, mediaUrl, appUser, schedule, tweetId) {
  let tmpUrl = '';
  if (mediaUrl == '') {
    tmpUrl = 'false';
  } else {
    tmpUrl = mediaUrl;
  }
  let query = `INSERT OR REPLACE INTO post (post_description, media_url, tweet_id, schedule, app_user)VALUES ('${description}', '${tmpUrl}', '${tweetId}', '${schedule}', '${appUser}')`;

  return new Promise(async (resolve, reject) => {
    sqliteDB.run(query, [],
      function (err) {
        if (err) {
          console.log('erro --> ' + err.code);
          console.log('mensagem --> ' + err.message);
          // console.log(err);
          reject(err.errno);
        }
        // there is a this.lastId avaliable to be used in his function context
        var affectedRows = this.changes;
        var lastId = this.lastID;
        // console.log('Above, the object');
        if (affectedRows == '1') {
          if (schedule != 'false') {
            createSchedule(sqliteDB, schedule, lastId);
          }
          resolve({ affectedRows: affectedRows, lastId: lastId });
        }
      }
    )
  });
};

const updateAppUserTw = async function (sqliteDB, userID, appUser) {
  // register new user
  let query = `UPDATE app_user SET tw_id = '${userID}' WHERE username = '${appUser}'`;
  sqliteDB.run(query, [],
    function (err) {
      if (err) {
        console.log('erro --> ' + err.code);
        console.log('mensagem --> ' + err.message);
        // console.log(err);
        return;
      }
      // there is a this.lastId avaliable to be used in his function context
      var affectedRows = this.changes;
      if (affectedRows == '1') {
        return;
      }
    }
  )
};

const createSchedule = async function (sqliteDB, scheduleDate, postId) {
  // register new user
  let query = `INSERT INTO schedule (schedule_date, post_id)VALUES ('${scheduleDate}', '${postId}')`;
  sqliteDB.run(query, [],
    function (err) {
      if (err) {
        console.log('erro --> ' + err.code);
        console.log('mensagem --> ' + err.message);
        console.log('error number -->' + err.errno);
      }
      // there is a this.lastId avaliable to be used in his function context
      var affectedRows = this.changes;
      if (affectedRows == '1') {
        console.log('Schedule created');
      }
    }
  )
};

const deleteSchedule = async function (sqliteDB, postId) {
  var data = [];
  var query = `DELETE FROM schedule WHERE post_id = '${postId}'`;
  sqliteDB.each(query,
    // callback that runs for each row
    (err, row) => {
      data.push(row);
    },
    // callback that runs after completion
    (err, numRows) => {
      // console.log(numRows);
      //err ? callback(err) : callback(numRows)
    })
};

/**
 * 1 - search for posts scheduled in database:
 *  only those not marked as posted, in the next 1 minute or before
 *    that way, it will fetch only posts that should already have been posted and those meant to be posted in the next minute
 */
exports.getScheduledPosts = async function (sqliteDB) {

  let data = [];
  let query =
    `SELECT s.id as scheduleId, 
  s.schedule_date as date, 
  p.post_id as postId,
  p.post_description as postDescription, 
  p.media_url as mediaUrl, 
  tu.user_id as userId,
  tu.access_token as accessToken, 
  tu.refresh_token as refreshToken 
  FROM schedule s 
  INNER JOIN post p ON s.post_id = p.post_id 
  INNER JOIN app_user au ON p.app_user = au.username 
  INNER JOIN tw_user tu ON au.tw_id = tu.user_id`;

  return new Promise((resolve, reject) => {
    sqliteDB.each(query,
      // callback that runs for each row
      (err, row) => {
        //console.log(row);
        data.push(row)
      },
      // callback that runs after completion
      (err, numRows) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(data);
        }
      })
  });
};


exports.updatePost = async function (sqliteDB, tweetId, postId) {
  // register new user
  let query = `UPDATE post 
  SET tweet_id = '${tweetId}' ,
  schedule = 'done'
  WHERE post_id = '${postId}'`;
  sqliteDB.run(query, [],
    function (err) {
      if (err) {
        console.log('erro --> ' + err.code);
        console.log('mensagem --> ' + err.message);
        // console.log(err);
        return;
      }
      // there is a this.lastId avaliable to be used in his function context
      var affectedRows = this.changes;
      if (affectedRows == '1') {
        deleteSchedule(sqliteDB, postId)
        return;
      }
    }
  )
};