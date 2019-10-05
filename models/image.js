var mongoose = require('mongoose');

var imageSchema = mongoose.Schema ({
  name: String,
  img: Buffer,
  contentType:String
});

var Image = module.exports = mongoose.model('Image', imageSchema);
