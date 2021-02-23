// const express = require('express');
// const router = express.Router();
// const { check, validationResult } = require('express-validator');
// const InstituteDegree = require('../../models/InstituteDegree');

// // @router POST api/institute
// // @desc Add new Degree
// // @access Public
// router.post(
//   '/',
//   [
//     check('instituteName', 'Institute name is required.').notEmpty(),
//     check('degreeName', 'Degree name is required.').notEmpty(),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const { instituteName, degreeName } = req.body;
//     try {
//       let inst = await InstituteDegree.findOne({ instituteName, degreeName });
//       if (inst) {
//         return res
//           .status(400)
//           .json({ errors: [{ msg: 'Record already exists' }] });
//       }
//       inst = new InstituteDegree({
//         instituteName,
//         degreeName,
//       });
//       await inst.save();
//       res.json({ msg: 'Record added.', inst });
//     } catch (err) {
//       return res.status(500).send('Server Error.');
//     }
//   }
// );

// // @router GET api/institute/:instituteName
// // @desc Get all degrees that belong to an insitute
// // @access Public
// router.get('/:instituteName', async (req, res) => {
//   try {
//     let degrees = await InstituteDegree.find({
//       instituteName: req.params.instituteName,
//     });
//     console.log(degrees.length, degrees);
//     if (degrees.length == 0)
//       return res
//         .status(400)
//         .json({ error: [{ msg: 'Institute does not exists.' }] });
//     res.json(degrees);
//   } catch (err) {
//     console.log(err.message);
//     return res.status(500).send('Server Error.');
//   }
// });

// // @router GET api/institute/:instituteName/:degreeName
// // @desc Get a degree that belong to an insitute
// // @access Public
// router.get('/:instituteName/:degreeName', async (req, res) => {
//   try {
//     let record = await InstituteDegree.find({
//       instituteName: req.params.instituteName,
//       degreeName: req.params.degreeName,
//     });
//     if (record.length == 0)
//       return res.status(400).json({
//         error: [{ msg: 'Institute with this degree does not exists.' }],
//       });
//     res.json(record);
//   } catch (err) {
//     return res.status(500).send('Server Error.');
//   }
// });

// // @router GET api/institute/?id
// // @desc Get a degree that belong to an insitute
// // @access Public
// router.get('/', async (req, res) => {
//   try {
//     if (req.query.id) {
//       if (req.query.id.length != 24) {
//         return res
//           .status(400)
//           .json({ errors: [{ msg: 'Invalid Id. No record found' }] });
//       }
//       let record = await InstituteDegree.findById(req.query.id);
//       if (record.length == 0)
//         return res
//           .status(400)
//           .json({ error: [{ msg: 'Record with this id does not exist.' }] });
//       res.json(record);
//     }
//     let records = await InstituteDegree.find().select('instituteName');
//     res.json(records);
//   } catch (err) {
//     console.error(err.message);
//     return res.status(500).send('Server Error.');
//   }
// });

// module.exports = router;
