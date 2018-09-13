//      

/**
 * Build path for the request
 * @param {string} apiKey The first number.
 * @param {string} city The second number.
 * @param {string} date The second number.
 * @param {number} numOfDays The second number.
 * @returns {string} The sum of the two numbers.
 */
function createPath(apiKey        , city        , date        , numOfDays         = 1)         {
  return `/premium/v1/weather.ashx?format=json&num_of_days=${numOfDays}
          &q= ${encodeURIComponent(city)}
          &key=${apiKey}
          &date=${date}`;
}

const helpers = {
  createPath,
};

module.exports = helpers;
