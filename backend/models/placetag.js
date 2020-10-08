const mongoose = require('mongoose');

const placetagSchema = mongoose.Schema({
  place_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  tag_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tag', required: true },
});

module.exports = mongoose.model('Placetag', placetagSchema);
