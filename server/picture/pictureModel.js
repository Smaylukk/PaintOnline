const { Schema, model } = require('mongoose');

const PictureSchema = new Schema({
  session: { type: String, unique: true, required: true },
  picture: { type: String, required: true }
})


module.exports = model('Picture', PictureSchema);