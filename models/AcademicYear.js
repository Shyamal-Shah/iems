const mongoose = require('mongoose');
const AcademicYearSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  subjects: [
    {
      subjectName: mongoose.Schema.Types.ObjectId,
      ref: 'subject',
      required: true,
    },
  ],
});

module.exports = AcademicYear = mongoose.model(
  'academicYear',
  AcademicYearSchema
);
