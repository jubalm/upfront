var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PageSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  permalink: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    dropDups: true
  },
  content: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Page', PageSchema);
