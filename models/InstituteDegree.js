const mongoose = require('mongoose');

// InstituteDegree schema containing instituteName, degreeName, createdUserID
// (Foreign Key), recStatus, modifiedUserID(Foreign Key) and timeStamps for 
// created and modified time
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
  // Creates timestamps for record created and when it is modified
  { timestamps: true }
);

// Export the schema with table name tblInstituteDegree
module.exports = InstituteDegree = mongoose.model(
  'institute_degree',
  InstituteDegreeSchema
);
