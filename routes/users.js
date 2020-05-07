const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const validator = require("../validator");
const emailRegist = require("../email/register");
const recoverRegist = require('../email/recovery');
const Users = require("../module/users");

router.get('/', function(req, res, next) {
	const isError = req.app.locals.errors ? req.app.locals.errors : false ;
	res.render('users', { title: 'Users', isUsers: true, isError });
	if(isError) delete req.app.locals.errors ;
});

router.post('/login', async function(req, res, next) {
	try{
		const { email, password } = req.body;
		const user = await Users.findOne({email});
		
		if(user === null || !bcrypt.compareSync(password, user.password)){
			req.app.locals.errors = "Such E-mail not existing either wrong password"
			return res.redirect('/users/#login')
		}

		req.session.user = user;
		req.session.auth = true;
		res.redirect("/")
	}catch(e){
		console.log(e)
	}
});

router.post('/regist', validator.registValid, async function(req, res){
	try{
		const { name, email, password } = req.body;
		const hash = bcrypt.hashSync(password , salt);
		const user = new Users({ name, email, password: hash, card: {items:[], old:[]}, token: null, expireToken: null, avatar: null })
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			req.app.locals.errors = errors.array()[0].msg;
			return res.status(422).redirect("/users/#regist");
		}

		await user.save()
		await emailRegist(email)
		res.redirect('/users/#login')

	}catch(e){
		console.log(e)
	}
})

router.post('/restore', validator.forgetValid,function(req, res){
	try{
		const { email } = req.body;
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			req.app.locals.errors = errors.array()[0].msg;
			return res.status(422).redirect('/users/forget')
		}

		crypto.randomBytes(32,async (err, but) => {
			if (err) throw err;
			const token = but.toString('hex');
			await recoverRegist(email, token);
			await Users.updateOne({ email }, { token, expireToken: Date.now() + 1000 * 60 * 60 });
			return res.redirect('/users/#login');
		})
	}catch(e){
		console.log(e)
	}
});

router.post('/update', validator.recoveryValid, async function(req, res){
	try{
		const { userID, token, password, confirmed } = req.body;
		const hash = bcrypt.hashSync(password, salt);
		const errors = validationResult(req);
		
		if (!errors.isEmpty()) {
			req.app.locals.errors = errors.array()[0].msg;
			return res.status(422).redirect('/users/recovery/' + token);
		}

		await Users.updateOne({_id: userID},{password: hash})
		return res.redirect('/users/#login');
	}catch(e){
		console.log(e)
	}
})

router.get('/recovery/:token', async function(req, res){
	try{
		const { token } = req.params
		const user = await Users.findOne({ token });
		const isError = req.app.locals.errors ? req.app.locals.errors : false; 
		if(user === null || user.expireToken < Date.now()){
			return res.redirect('/users/#login')
		}
		res.render('recovery',{ title: "Recovery", isUser: user, isError})
		if(isError) delete req.app.locals.errors;
	}catch(e){
		console.log(e)
	}
})

router.post('/upload', async function(req, res){
	try{
		const { user } = req.session;
		const obj = new Object()
		if(req.body) obj.name = req.body.name;
		if(req.file) obj.avatar = req.file.path;

		await Users.updateOne({_id: user._id},obj)
		res.redirect('/users/profile')
	}catch(e){
		console.log(e)
	}
})

router.get('/forget', function(req, res){
	const isError = req.app.locals.errors ? req.app.locals.errors : false ;
	res.render("forget", { title: "Forget", isError });
	if(isError) delete req.app.locals.errors
})

router.get('/logout', function(req, res){
	req.session.destroy(() => {
		res.redirect('/users')
	})
})

router.get('/profile', function(req, res){
	const { user } = req.session;
	res.render('profile', {title: "Profile", isProfile: true, isUser: user})
})

module.exports = router;

