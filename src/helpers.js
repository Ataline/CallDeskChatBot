// @flow

/**
 * Build path for the request
 * @param {string} apiKey The first number.
 * @param {string} city The second number.
 * @param {string} date The second number.
 * @param {number} numOfDays The second number.
 * @returns {string} The sum of the two numbers.
 */
function createPath(apiKey: string, city: string, date: string, numOfDays: number = 1): string {
  return `/premium/v1/weather.ashx?format=json&num_of_days=${numOfDays}
          &q= ${encodeURIComponent(city)}
          &key=${apiKey}
          &date=${date}`;
}

const helpers = {
  createPath,
};

module.exports = helpers;
