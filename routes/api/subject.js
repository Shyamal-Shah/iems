const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Subject = require('../../models/Subject');
const InstituteDegree = require('../../models/InstituteDegree');

// @router POST api/subject
// @desc Add new Subjects
// @access public
router.post(
  '/',
  [
    check('subjectName', 'Name of subject is required.').notEmpty(),
    check('subjectCode', 'Code of subject is required.').notEmpty(),
    check('degreeId', 'DegreeID  is required.').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { subjectName, subjectCode, degreeId } = req.body;
    if (degreeId.length != 24) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Invalid degreeId. No degree found' }] });
    }
    try {
      let instDeg = await InstituteDegree.findById(degreeId);
      if (!instDeg) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid degreeId. No degree found' }] });
      }
      let subject = await Subject.findOne({ subjectName, subjectCode });
      if (subject) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Subject record already exists.' }] });
      }
      subject = new Subject({
        subjectName,
        subjectCode,
        degreeId,
      });
      await subject.save();
      res.json({ msg: 'Subject added.', subject });
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server Error.');
    }
  }
);

// @router GET api/subject/?id&?subjectName&?subjectCode&degreeId
// @desc Get Subjects based on ids or subjectName or subjectCode
// @access public
router.get('/', async (req, res) => {
  try {
    if (req.query.id) {
      if (req.query.id.length != 24) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid SubjectID. No subject found.' }] });
      }
      let subject = await Subject.findById(req.query.id);
      if (!subject) {
        return res
          .status(400)
          .json({ error: [{ msg: 'Record with this id does not exist.' }] });
      }
      res.json(subject);
    } else if (req.query.subjectName) {
      let subject = await Subject.findOne({
        subjectName: req.query.subjectName,
      });
      if (!subject)
        return res
          .status(400)
          .json({ error: [{ msg: 'Subject does not exists.' }] });
      res.json(subject);
    } else if (req.query.subjectCode) {
      let subject = await Subject.findOne({
        subjectCode: req.query.subjectCode,
      });
      if (!subject)
        return res.status(400).json({
          error: [{ msg: 'Subject with this code does not exists.' }],
        });
      res.json(subject);
    } else if (req.query.degreeId) {
      if (req.query.id.length != 24) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid degreeId. No subjects found.' }] });
      }
      let subjects = await Subject.find({
        degreeId: req.query.degreeId,
      });
      if (subjects.length == 0)
        return res.status(400).json({
          error: [
            { msg: 'Subjects that belong to this degreeId does not exists.' },
          ],
        });
      res.json(subject);
    } else if (Object.keys(req.query).length == 0) {
      let subjects = await Subject.find({});
      return res.json(subjects);
    } else {
      res.status(400).send('Bad request');
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error.');
  }
});

module.exports = router;
