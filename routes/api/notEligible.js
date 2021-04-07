const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const NotEligible = require("../../models/NotEligibility");

// @router POST api/not-eligible
// @desc Add new not eligible students
// @access Private
router.post(
  "/",
  [
    auth,
    check("academicYear", "Academic Year is required").notEmpty(),
    check("semester", "Semester is required").notEmpty(),
    check("subject", "Subject is required").notEmpty(),
    check("componentName", "Component Name is required").notEmpty(),
    check("students", "Students is required").isArray({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        msg: "Validation error occured.",
      });
    }
    const {
      academicYear,
      semester,
      subject,
      componentName,
      students,
    } = req.body;

    try {
      let ne = await NotEligible.findOne({
        academicYear: academicYear,
        semester: semester,
        subject: subject,
        componentName: componentName,
      });
      if (ne) {
        ne.modifiedUserID = req.user.id;
        ne.students = students;
      } else {
        ne = new NotEligible({
          modifiedUserID: req.user.id,
          createdUserID: req.user.id,
          academicYear,
          semester,
          subject,
          componentName,
          students,
        });
      }

      await ne.save();
      res.json({
        msg: "Not eligible students are added.",
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send("Server Error.");
    }
  }
);

// @router GET api/not-eligible/?academicYear?semester?subject?componentName
// @desc Get not eligible students
// @access Private
router.get("/", auth, async (req, res) => {
  const { academicYear, subject, semester, componentName } = req.query;
  try {
    if (subject) {
      if (subject.length != 24) {
        return res.status(400).json({
          errors: [{ msg: "Invalid Subject Id. No record found" }],
        });
      }
      if (academicYear && semester && componentName) {
        let ne = await NotEligible.findOne({
          academicYear,
          semester,
          subject,
          componentName,
        });
        if (!ne) {
          return res.status(400).json({
            msg: "Records with this semester number does not exist.",
          });
        }
        return res.json(ne.students);
      }
    }
  } catch (e) {
    return res.send(e.message);
  }
});

module.exports = router;
