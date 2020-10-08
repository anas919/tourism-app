const mongoose = require('mongoose');
const moment= require('moment') 
const placeSchema = mongoose.Schema({
  title: { type: String, required: true},
  city: { type: String, required: true},
  country: { type: String, required: true},
  start_date: { type: Date, default: moment().format('YYYY-MM-DD h:mm:ss a') },
  latitude: { type: String, required: true},
  longitude: { type: String, required: true},
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imagePath: { type: String, required: true}
});

module.exports = mongoose.model('Place', placeSchema);
