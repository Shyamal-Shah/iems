const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: true,
  },
  subjectCode: {
    type: String,
    required: true,
  },
  degree: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'institute',
    required: true,
  },
});

module.exports = Subject = mongoose.model('subjects', SubjectSchema);
