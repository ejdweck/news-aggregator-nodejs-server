const Sentiment = require('sentiment');

async function sentimentAnalysis(jsonData) {
  let i;
  for (i = 0; i < jsonData.articles.length; i++) {
    let sentiment = new Sentiment();
    //console.log(jsonData.articles[i].title)
    let result = await sentiment.analyze(
      jsonData.articles[i].title.toString()
    )
    jsonData.articles[i].score = result;
    //console.log(result)
  }
  return JSON.stringify(jsonData); 
}

module.exports = sentimentAnalysis;