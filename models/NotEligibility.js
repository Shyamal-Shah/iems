const mongoose = require("mongoose");

const NotEligibilitySchema = new mongoose.Schema(
  {
    academicYear: {
      type: String,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subjects",
    },
    componentName: {
      type: String,
      required: true,
    },
    students: [
      {
        studentId: {
          type: String,
          required: true,
        },
      },
    ],
    createdUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    modifiedUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    recStatus: {
      type: String,
      default: "A",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = NotEligibility = mongoose.model(
  "tblNotEligibleStudents",
  NotEligibilitySchema
);
