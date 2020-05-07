const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const validator = require("../validator/index");
const Course = require("../module/courses");

router.get('/', function(req, res, next) {
	const isError = req.app.locals.errors ? req.app.locals.errors : false;
	res.render('add', { title: 'Add', isAdd: true, isError });
	if(isError) delete req.app.locals.errors
});

router.post('/addition', validator.addValid, async function(req, res){
	try{
		const {name, price, url, courseID} = req.body;
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			req.app.locals.errors = errors.array()[0].msg;
			return res.status(422).redirect('/add');
		}

		if(courseID.toString().length){
			await Course.updateOne({_id: courseID},{name, price, url});
		}else{
			await new Course({name, price, url, userID: req.session.user._id}).save();
		}
		
		res.redirect('/courses')
	}catch(e){
		console.log(e)
	}
})

router.get('/edit/:id', async function(req, res){
	try{
		const { id } = req.params;
		const isCourse = await Course.findById(id);
		res.render('edit', { title: 'Add', isAdd: true, isCourse});
	}catch(e){
		console.log(e)
	}
})

module.exports = router;
