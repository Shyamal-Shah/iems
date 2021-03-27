const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const ExamSchedule = require("../../models/ExamSchedule");

// @router POST api/pedagogy
// @desc Add new pedagogy
// @access public
router.post(
  "/",
  [
    check("academicYear", "Academic Year is required.").notEmpty(),
    check("semester", "Semester is required").notEmpty(),
    check("schedule", "Schedule is required").isArray({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { academicYear, semester, schedule } = req.body;

    try {
      let examschedule = await ExamSchedule.findOne({
        academicYear: academicYear,
        semester: semester,
      });
      if (examschedule) {
        examschedule.schedule = schedule;
      } else {
        examschedule = new ExamSchedule({
          academicYear,
          semester,
          schedule,
        });
      }
      await examschedule.save();
      res.json({ msg: "Exam Schedule added", examschedule });
    } catch (e) {
      return res.status(500).send("Server Error.");
    }
  }
);

// @router POST api/pedagogy
// @desc Add new pedagogy
// @access public
router.get("/", async (req, res) => {
  try {
    const examschedules = await ExamSchedule.find({});
    return res.send(examschedules);
  } catch (e) {
    return res.send(e.message);
  }
});

module.exports = router;
