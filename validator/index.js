const { body } = require('express-validator');
const Users = require("../module/users");
const Courses = require("../module/courses");

exports.registValid = [
	body('name').trim().isLength({ min: 3 }).withMessage('must be at least 3 chars long in field Name'),
	body('email').trim().isEmail().normalizeEmail().withMessage('email entered wrong').custom(async (val, {req}) => {
		const users = await Users.findOne({email: val});
		if(users !== null){
			throw new Error("Such email been used"+ val)
		}
	}),
	body('password').isLength({ min: 5 }).withMessage('must be at least 5 chars long  in field Password').custom(async (val, { req }) => {
		if(val !== req.body.confirmed){
			return Promise.reject('Password confirmation does not match password');
		}
	}),
]

exports.forgetValid = [
	body("email").custom(async (val, {req}) => {
		const user = await Users.findOne({email: val});
		if(user === null) return Promise.reject("Such email not existings")
	})
]

exports.recoveryValid = [
	body("userID").custom(async (val, { req }) => {
		const user = await Users.findOne({_id: val});
		if(!(user._id.toString() == val && user.token === req.body.token)) throw new Error("Input data make error");
		return true
	}),
	body("password").custom((val, { req }) => {
		if( val !== req.body.confirmed ) throw new Error("Please entered corresponding password")
		return true
	}),
]

exports.addValid = [
	body("name").isLength({ min: 3 }).withMessage('must be at least 3 chars long').custom( async (val, { req }) => {
		const course = await Courses.findOne({name: val});
		if(course !== null && req.body.courseID === null){
			return Promise.reject("Such course been created")
		}
		return true
	}),
	body("price").isLength({ min: 1 }).withMessage('must be at least 1 chars long').matches(/\d/).withMessage('must contain a number'),
	body("url").exists().withMessage('Please fill field Url')
]