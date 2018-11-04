let pd = require('paralleldots');

pd.apiKey = "";

async function pdSentimentAnalysis(jsonData) {
  let text_array = [];
  let i;
  for (i = 0; i < jsonData.articles.length; i++) {
    console.log(jsonData.articles[i].title)
    text_array.push(jsonData.articles[i].title)
  }
  text_array = JSON.stringify(text_array);
  console.log(text_array);
  let result = await pd.sentimentBatch(text_array, 'en')
    .then((response) => {
      console.log(response);
      return response;
    }).catch((error) =>{
      console.log(error);
    })
  return result; 
}

module.exports = pdSentimentAnalysis;
