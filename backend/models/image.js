const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
  imagePath: { type: String, required: true}
  // place_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true }
});

module.exports = mongoose.model('Image', imageSchema);
