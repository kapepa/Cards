const express = require('express');
const router = express.Router();
const Courses = require("../module/courses");

router.get('/',async function(req, res, next) {
	try{
		const courses = await Courses.find();
		res.render('courses', { title: 'Courses', isCourses: true, isList: courses ? courses : false, isID: req.session.user ? req.session.user._id.toString() : false });
	}catch(e){
		console.log(e)
	}
});

module.exports = router;
