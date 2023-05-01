var fs = require('fs'),
  request = require('request');

const download = async function (uri, filename, callback) {

  // função retorna uma promisse, que só é resolvida após o arquivo criado ser fechado
  return new Promise(resolve =>{
    request.head(uri, function (err, res, body) {

      // console.log('content-type:', res.headers['content-type']);
      // console.log('content-length:', res.headers['content-length']);
  
      request(uri).pipe(fs.createWriteStream(filename)).on('close', function(){
        callback();
        resolve();
      });
    });
  })
};

/**
 * 
 * @param {*} images - array of urls generated by openaiAPI
 * @param {*} createdCode - code of generated images, by openAI
 * @returns - the folder path of the images
 */
exports.downloadImage = async function (images, createdCode) {
  fs.mkdir(__dirname + "/assets/images/" + createdCode, { recursive: true }, (err) => {
    if (err) throw err;
  });

  for(num in images){
    // console.log(num);
    await download(images[num].url, __dirname + "/assets/images/" + createdCode + "/" + num + ".png", function(){
      // console.log('done');
    })
  }
  return("/" + createdCode)
};