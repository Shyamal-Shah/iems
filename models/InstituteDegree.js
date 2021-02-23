const mongoose = require('mongoose');

const InstituteDegreeSchema = new mongoose.Schema(
  {
    instituteName: {
      type: String,
      required: true,
    },
    degrees: [
      {
        degreeName: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = InstituteDegree = mongoose.model(
  'institute_degree',
  InstituteDegreeSchema
);
