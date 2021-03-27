const mongoose = require("mongoose");
const ExamScheduleSchema = new mongoose.Schema(
  {
    academicYear: {
      type: String,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    schedule: [
      {
        subjectCode: {
          type: String,
          required: true,
        },
        subjectName: {
          type: String,
          required: true,
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
  },
  { timestamps: true }
);

module.exports = ExamSchedule = mongoose.model(
  "examschedule",
  ExamScheduleSchema
);
