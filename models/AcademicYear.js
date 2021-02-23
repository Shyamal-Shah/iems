const mongoose = require('mongoose');
const AcademicYearSchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: true,
    },
    semesters: [
      {
        semesterNo: {
          type: Number,
          required: true,
        },
        subjects: [
          {
            subjectName: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'subject',
              required: true,
            },
          },
        ],
      },
    ],
    degreeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'institute_degree',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = AcademicYear = mongoose.model(
  'academicYear',
  AcademicYearSchema
);
