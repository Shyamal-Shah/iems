const mongoose = require('mongoose');
const ExamScheduleSchema = new mongoose.Schema(
  {
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'academicYear',
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    testName: {
      type: String,
      required: true,
    },
    examWeekFrom:{
      type: String,
      required: true,
    },examWeekTo:{
      type: String,
      required: true,
    },
    schedule: [
      {
        subjectId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'subjects',
        },
        subjectName: {
          type: String,
        },
        subjectCode: {
          type: String,
        },
        from: {
          type: String,
          required: true,
        },
        to: {
          type: String,
          required: true,
        },
      },
    ],
    createdUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    modifiedUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    recStatus: {
      type: String,
      default: 'A',
    },
  },
  { timestamps: true }
);

module.exports = ExamSchedule = mongoose.model(
  'tblExamSchedule',
  ExamScheduleSchema
);
