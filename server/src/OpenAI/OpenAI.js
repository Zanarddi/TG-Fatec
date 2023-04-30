const constants = require('./../constants');
const { Configuration, OpenAIApi } = require("openai");
const { downloadImage } = require("./DownloadImage")

const configuration = new Configuration({
  organization: constants.OPENAI_ORG,
  apiKey: constants.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

/**
 * generate images, and create files in filesistem
 * 
 * usage example:
 * generateImage("A realistic normal mouse on a brown desk, realistic", 2).then(data=>console.log(data))
 * 
 * @param {*} userPrompt - text from which the image wil be generated
 * @param {*} qtdImg - how many images to be generated
 * @returns 
 */
exports.generateImage = async function (userPrompt, qtdImg) {
  
  return new Promise (async (resolve, reject) => {
    await openai.createImage({
      prompt: userPrompt,
      n: qtdImg,
      size: "1024x1024",
    }).then(async response => {
      // console.log('RESPONSE DATA');
      // console.log(response.data.data);
      // console.log(response.data.created);
      let created = response.data.created;
      await downloadImage(response.data.data, response.data.created).then((result)=>{
        resolve(result);
      })
      .catch((err)=>{
        resolve(err);
      })
    }).catch((err)=>{
      resolve(err);
    });
  });
};

