//

const http = require('http');
const functions = require('firebase-functions');
const helpers = require('./helpers');

const host         = 'api.worldweatheronline.com';
const wwoApiKey         = '68ded4de13b44bdcbbd73246181309';

const callWeatherApi = (city        , date        , numOfDays        )               => {
  const promise = Object.create(Promise);
  promise((resolve, reject) => {
    const url = {
      host,
      path: helpers.createPath(wwoApiKey, city, date, numOfDays),
    };

    http.get(url, (res) => {
      let body = '';
      res.on('data', (d) => { body += d; });
      res.on('end', () => {
        const responseData = JSON.parse(body).data;
        const forecast = responseData.weather[0];
        const location = responseData.request[0];
        const conditions = responseData.current_condition[0];
        const currentConditions = conditions.weatherDesc[0].value;


        const output = `Current conditions in the ${location.type}
        ${location.query} are ${currentConditions} with a projected high of
        ${forecast.maxtempC}°C or ${forecast.maxtempF}°F and a low of
        ${forecast.mintempC}°C or ${forecast.mintempF}°F on
        ${forecast.date}.`;

        // console.log(output);
        resolve(output);
      });
      res.on('error', (error) => {
        // console.log(`Error calling the weather API: ${error}`)
        reject(error);
      });
    });
  });
};

exports.weatherBot = functions.https.onRequest((req, res) => {
  const queryParams = req.body.queryResult.parameters;
  const city         = queryParams['geo-city'];
  const date         = queryParams.date.toString();
  const numOfDays         = queryParams.num_of_days;

  callWeatherApi(city, date, numOfDays).then((output) => {
    res.json({ fulfillmentText: output });
    throw Promise.resolve();
  }).catch(() => {
    res.json({ fulfillmentText: `I don't know the weather but I hope it's good!` });
  });
});
