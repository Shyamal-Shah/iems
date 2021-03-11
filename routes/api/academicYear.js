const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const AcademicYear = require('../../models/AcademicYear');

// @router POST api/academic-year
// @desc Add new academic year
// @access PUBLIC
router.post(
  '/',
  [
    check('year', 'Academic Year is required.').notEmpty(),
    check('degreeId', 'DegreeId is required.').notEmpty(),
    check('semesters', 'Semesters are required.').isArray({ min: 8, max: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { year, degreeId, semesters } = req.body;
    if (degreeId.length != 24) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Invalid degreeId. No degree found' }] });
    }
    try {
      const instDeg = await InstituteDegree.findOne({
        degrees: { $elemMatch: { _id: degreeId } },
      });
      if (!instDeg) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid degreeId. No degree found' }] });
      }
      let academicYear = await AcademicYear.findOne({ year, degreeId });
      if (academicYear) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Year already exists.' }] });
      }
      academicYear = new AcademicYear({
        year,
        degreeId,
        semesters,
      });

      await academicYear.save();
      res.json({ msg: 'Record added.', academicYear });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error.');
    }
  }
);

// @router GET api/academic-year/?id&?year&?semesterNo&?degreeId
// @desc Add new academic year
// @access PUBLIC
router.get('/', async (req, res) => {
  try {
    if (req.query.id) {
      if (req.query.id.length != 24) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Id. No record found' }] });
      }
      const academicYear = await AcademicYear.findById(req.query.id);
      if (!academicYear) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Id. No record found' }] });
      }
      return res.json(academicYear);
    } else if (req.query.year) {
      const academicYear = await AcademicYear.findOne({ year: req.query.year });
      if (!academicYear) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Record for this year does not exists.' }] });
      }
      if (req.query.semesterNo) {
        let year = academicYear;
        year.semesters = academicYear.semesters.filter(
          (sem) => sem.semesterNo == req.query.semesterNo
        );
        if (!year.semesters.length == 0) {
          return res.status(400).json({
            errors: [{ msg: 'This semester does not belon to this year.' }],
          });
        }
        return res.json(year);
      }
      return res.json(academicYear);
    } else if (req.query.degreeId) {
      const academicYears = await AcademicYear.find({
        degreeId: req.query.degreeId,
      })
        .populate({
          path: 'semesters',
          populate: {
            path: 'subjects',
            populate: {
              path: 'subjectId',
              select: ['subjectCode', 'subjectName'],
            },
          },
        })
        .sort({ year: -1 });
      if (academicYears.length === 0) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid degreeId. No record found' }] });
      }
      return res.json(academicYears);
    } else if (Object.keys(req.query).length == 0) {
      const years = await AcademicYear.find().select('year');
      return res.json(years);
    } else {
      return res.status(500).send('Bad request.');
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Server Error.');
  }
});

module.exports = router;
