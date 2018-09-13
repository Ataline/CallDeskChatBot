// @flow

const http = require('http');
const functions = require('firebase-functions');
const helpers = require('./helpers');

const host: string = 'api.worldweatheronline.com';
const wwoApiKey: string = '68ded4de13b44bdcbbd73246181309';

/**
 * Get the requested weather
 * @param {string} city The location for which the weather is needed.
 * @param {string} date The date for which the weather is needed.
 * @param {number} numOfDays The number of days for which the weather is needed.
 * @returns {string} The requested weather.
 */
function callWeatherApi(city: string, date: string, numOfDays: number): Promise<any> {
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
}

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((req, res) => {
  const queryParams = req.body.queryResult.parameters;
  const city: string = queryParams['geo-city'];
  const date: string = queryParams.date.toString();
  const numOfDays: number = queryParams.num_of_days;

  callWeatherApi(city, date, numOfDays).then((output) => {
    res.json({ fulfillmentText: output });
  }).catch(() => {
    res.json({ fulfillmentText: 'I don\'t know the weather but I hope it\'s good!' });
  });
});
