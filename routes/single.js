const express = require('express');
const router = express.Router();
const Courses = require("../module/courses");

router.get('/:id', async function(req, res, next) {
	const { id } = req.params;
	const isCourse = await Courses.findById({_id: id}) || false;
	const isID = req.session.user._id.toString() || false;
  res.render('single', { title: 'Sigle', isCourse, isID });
});

module.exports = router;
