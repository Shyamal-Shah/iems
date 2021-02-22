const mongoose = require('mongoose');

const InstituteSchema = new mongoose.Schema({
  instituteName: {
    type: String,
    required: true,
  },
  degreeName: {
    type: String,
    required: true,
  },
});

module.exports = Institute = mongoose.model('institutes', InstituteSchema);
