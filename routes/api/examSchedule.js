const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const ExamSchedule = require('../../models/ExamSchedule');

// @router POST api/pedagogy
// @desc Add new pedagogy
// @access Private
router.post(
  '/',
  [
    auth,
    check('academicYear', 'Academic Year is required.').notEmpty(),
    check('semester', 'Semester is required').notEmpty(),
    check('schedule', 'Schedule is required').isArray({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      academicYear,
      semester,
      schedule,
      testName,
      examWeekFrom,
      examWeekTo,
    } = req.body;
    try {
      let examschedule = await ExamSchedule.findOne({
        academicYear: academicYear,
        semester: semester,
        testName: testName,
      });
      if (examschedule) {
        examschedule.schedule = schedule;
        examschedule.modifiedUserID = req.user.id;
        examschedule.examWeekFrom = examWeekFrom;
        examschedule.examWeekTo = examWeekTo;
      } else {
        examschedule = new ExamSchedule({
          modifiedUserID: req.user.id,
          createdUserID: req.user.id,
          academicYear,
          semester,
          schedule,
          examWeekFrom,
          examWeekTo,
          testName,
        });
      }
      await examschedule.save();
      res.json({ msg: 'Exam Schedule added', examschedule });
    } catch (e) {
      console.log(e);
      return res.status(500).send('Server Error.');
    }
  }
);

// @router POST api/pedagogy/?semesterNo&?academicYear
// @desc Add new pedagogy
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    if (req.query.academicYear) {
      if (req.query.academicYear.length != 24) {
        return res.status(400).json({
          errors: [{ msg: 'Invalid Academic Year Id. No record found' }],
        });
      }
      if (req.query.semesterNo && req.query.testName) {
        let schedules = await ExamSchedule.findOne({
          semester: req.query.semesterNo,
          academicYear: req.query.academicYear,
          testName: req.query.testName,
        }).populate({
          path: 'schedule',
          populate: {
            path: 'subjectId',
            select: ['subjectCode', 'subjectName'],
          },
        });

        if (!schedules) {
          return res.status(400).json({
            errors: [
              { msg: 'Records with this semester number does not exist.' },
            ],
          });
        }
        return res.json(schedules);
      }
    }
  } catch (e) {
    return res.send(e.message);
  }
});

module.exports = router;
