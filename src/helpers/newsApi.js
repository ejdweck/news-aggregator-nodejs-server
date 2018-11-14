const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('c477fa4aa1474688a99cb5392449a6fd');
// To query /v2/top-headlines
// All options passed to topHeadlines are optional, but you need to include at least one of them
async function callNewsApi(sources, query) {
  //console.log('calling NEWS api')
  //console.log(typeof sources)
  //console.log(sources)
  sources = sources.toString()
  let response = await newsapi.v2.topHeadlines({
    sources: sources,
    q: query,
    language: 'en',
    }).then(response => {
      //console.log('NEWS API response: ', response);
      return JSON.stringify(response);
    });
  //console.log('TESTTTTTT' + response);
  console.log('type of ', typeof response);

  return response;
}

module.exports = callNewsApi;