const express = require('express');
const unirest = require('unirest');


const router = express.Router();

const request = unirest('GET', 'http://api.openweathermap.org/data/2.5/weather?q=Taza&appid=0cc13a4cd053dabddd0e2c40e5e9e108');


router.get('',(req, res, next) => {
  request.headers({
    // "q": "Taza",
    // "appid": "0cc13a4cd053dabddd0e2c40e5e9e108"
  });
  request.end(function (result) {
  	res.status(200).json({
        message: "Weather fetched successfully! ",
        weather: result
      });
  if (result.error) throw new Error(result.error);
  });
});

module.exports = router;
