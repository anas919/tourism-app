const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./routes/users');
const placesRoutes = require('./routes/places');
const placetagsRoutes = require('./routes/placetags');
const tagsRoutes = require('./routes/tags');
const weatherRoutes = require('./routes/weather');
//api call new

const app = express();

mongoose
  .connect(
    'mongodb://localhost/tourisme_db'
  )
  .then(() => {
    console.log('Connnected to database');
  })
  .catch((err) => {
    console.log('Connection failed' + err);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, 'images')));

app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

app.use('/api/users', userRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/placetags', placetagsRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/weather', weatherRoutes);


module.exports = app;
