const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const InstituteDegree = require('../../models/InstituteDegree');

// @router POST api/institute
// @desc Add new Degree
// @access Public
router.post(
  '/',
  [
    check('instituteName', 'Institute name is required.').notEmpty(),
    check('degrees', 'Degrees are required.').isArray({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { instituteName, degrees } = req.body;
    try {
      let institute = await InstituteDegree.findOne({ instituteName });
      if (institute) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Institute already exists.' }] });
      }
      institute = new InstituteDegree({
        instituteName,
        degrees,
      });
      await institute.save();
      res.json({ msg: 'Record added.', institute });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error.');
    }
  }
);

// @router GET api/institute/?id&?instituteName&?degreeName
// @desc Get institutes and degrees based on query
// @access Public
router.get('/', auth, async (req, res) => {
  try {
    if (req.query.id) {
      if (req.query.id.length != 24) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Id. No record found' }] });
      }
      let institute = await InstituteDegree.findById(req.query.id);
      if (!institute) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Record with this id does not exist.' }] });
      }
      return res.json(institute);
    } else if (req.query.instituteName) {
      let institute = await InstituteDegree.findOne({
        instituteName: req.query.instituteName,
      });
      if (!institute) {
        return res.status(400).json({
          errors: [{ msg: 'Institute with this name does not exists.' }],
        });
      }
      if (req.query.degreeName) {
        let inst = institute;
        inst.degrees = institute.degrees.filter(
          (degree) => degree.degreeName == req.query.degreeName
        );
        if (inst.degrees.length == 0) {
          return res.status(400).json({
            errors: [{ msg: 'This degree does not belong to this institute.' }],
          });
        }
        return res.json(inst);
      }
      return res.json(institute);
    } else if (Object.keys(req.query).length == 0) {
      let institutes = await InstituteDegree.find({}).sort({'instituteName':1});
      res.json(institutes);
    } else {
      res.status(400).send('Bad request');
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Server Error.');
  }
});

// @router PUT api/institute/:instituteId
// @desc Add more degrees to an institute
// @access Public
router.put(
  '/:instituteId',
  [check('degrees', 'Degrees are required.').isArray({ min: 1 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { degrees } = req.body;
    try {
      let institute = await InstituteDegree.findById(req.params.instituteId);
      if (!institute) {
        return res.status(400).json({
          errors: [{ msg: 'Institute with this Id does not exists.' }],
        });
      }
      degrees.forEach((degree) => {
        let flag = true;
        institute.degrees.forEach((deg) => {
          if (deg.degreeName == degree.degreeName) flag = false;
        });
        if (flag) institute.degrees.unshift(degree);
      });
      await institute.save();
      res.json(institute);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error.');
    }
  }
);

module.exports = router;
