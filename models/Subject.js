const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: true,
    },
    subjectCode: {
      type: String,
      required: true,
    },
    degreeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'institute_degree',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = Subject = mongoose.model('subjects', SubjectSchema);
