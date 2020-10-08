const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
  name: { type: String, required: true},
  imagePath: { type: String, required: true}
});

module.exports = mongoose.model('Tag', tagSchema);
