const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

// Models
const Resources = require("../../models/Resources");
const AcademicYear = require("../../models/AcademicYear");
const InstituteDegree = require("../../models/InstituteDegree");

// @router POST api/resources
// @desc Add new resources
// @access PRIVATE
router.post(
  "/",
  [
    auth,
    check("academicYear", "Academic year is required.").notEmpty(),
    check("degreeId", "Degree is required.").notEmpty(),
    check("semester", "Semester is required.").notEmpty(),
    check("classes", "Classes are required").isArray({ min: 1 }),
    check("labs", "Labs are required").isArray({ min: 1 }),
  ],
  async (req, res) => {
    // If any argument check fails return the array of errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Destructuring the academic academicYear,degreeId,semester,classes,labs from req.body
    const { academicYear, degreeId, semester, classes, labs } = req.body;

    try {
      // Find the resources with academicYear, degreeId, semester
      let resources = await Resources.findOne({
        academicYear,
        degreeId,
        semester,
      });
      // If it exists then just add the classes and labs to the resource.
      if (resources) {
        resources.classes = classes;
        resources.labs = labs;
        resources.modifiedUserID = req.user.id;
      }
      // If it doesn't exist then just add the resources with all other fields.
      else {
        let academicYearExist = await AcademicYear.findById(academicYear);
        let degreeExist = await InstituteDegree.findOne({
          degrees: { $elemMatch: { _id: degreeId } },
        });

        if (!academicYearExist) {
          return res.status(400).send("Academic Year Id is not valid.");
        }

        if (!degreeExist) {
          return res.status(400).send("Degree Id is not valid.");
        }

        resources = new Resources({
          academicYear,
          degreeId,
          semester,
          classes,
          labs,
        });
      }
      // Save the resources to the database.
      await resources.save();
      // Return the the response.
      res.json({ msg: "Resources added.", resources });
    } catch (error) {
      // If the error exists then return response.
      console.log(error.message);
      return res.status(500).send("Server error.");
    }
  }
);

module.exports = router;
