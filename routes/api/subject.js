// const express = require('express');
// const router = express.Router();
// const { check, validationResult } = require('express-validator');
// const Subject = require('../../models/Subject');
// const InstituteDegree = require('../../models/InstituteDegree');

// // @router POST api/subject
// // @desc Add new Subjects
// // @access public
// router.post(
//   '/',
//   [
//     check('subjectName', 'Name of subject is required.').notEmpty(),
//     check('subjectCode', 'Code of subject is required.').notEmpty(),
//     check('degreeId', 'DegreeID  is required.').notEmpty(),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const { subjectName, subjectCode, degreeId } = req.body;
//     if (degreeId.length != 24) {
//       return res
//         .status(400)
//         .json({ errors: [{ msg: 'Invalid degreeId. No degree found' }] });
//     }
//     try {
//       let instDeg = await InstituteDegree.findById(degreeId);
//       if (!instDeg) {
//         return res
//           .status(400)
//           .json({ errors: [{ msg: 'Invalid degreeId. No degree found' }] });
//       }
//       let subject = await Subject.findOne({ subjectName, subjectCode });
//       if (subject) {
//         return res
//           .status(400)
//           .json({ errors: [{ msg: 'Subject record already exists.' }] });
//       }
//       subject = new Subject({
//         subjectName,
//         subjectCode,
//         degreeId,
//       });
//       await subject.save();
//       res.json({ msg: 'Subject added.', subject });
//     } catch (err) {
//       console.log(err.message);
//       return res.status(500).send('Server Error.');
//     }
//   }
// );

// // @router GET api/subject/?id
// // @desc Get Subjects based on ids
// // @access public
// router.get('/', async (req, res) => {
//   try {
//     if (req.query.id.length != 24) {
//       return res
//         .status(400)
//         .json({ errors: [{ msg: 'Invalid SubjectID. No subject found.' }] });
//     }
//     let subject = await Subject.findById(req.query.id);
//     if (subject.length == 0) {
//       return res
//         .status(400)
//         .json({ error: [{ msg: 'Record with this id does not exist.' }] });
//     }
//     res.json(subject);
//   } catch (err) {
//     console.error(err.message);
//     return res.status(500).send('Server Error.');
//   }
// });

// // @router GET api/subject/:subjectName
// // @desc Get all degrees that belong to an insitute
// // @access Public
// router.get('/:subjectName', async (req, res) => {
//   try {
//     let subjects = await Subject.find({
//       subjectName: req.params.subjectName,
//     });
//     if (subjects.length == 0)
//       return res
//         .status(400)
//         .json({ error: [{ msg: 'Subject does not exists.' }] });
//     res.json(subjects);
//   } catch (err) {
//     console.log(err.message);
//     return res.status(500).send('Server Error.');
//   }
// });

// // @router GET api/subject/:subjectName/:subjectCode
// // @desc Get a degree that belong to an insitute
// // @access Public
// router.get('/:subjectCode/:subjectName', async (req, res) => {
//   try {
//     let record = await Subject.find({
//       subjectName: req.params.subjectName,
//       subjectCode: req.params.subjectCode,
//     });
//     if (record.length == 0)
//       return res.status(400).json({
//         error: [{ msg: 'Subject with this code does not exists.' }],
//       });
//     res.json(record);
//   } catch (err) {
//     return res.status(500).send('Server Error.');
//   }
// });

// module.exports = router;
