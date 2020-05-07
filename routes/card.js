const express = require('express');
const router = express.Router();
const multer  = require('multer');
const User = require("../module/users");
const Courses = require("../module/courses");

router.get('/', async function(req, res, next) {
	try{
		const { user } = req.session;
		const isList = await Courses.transform(user.card.items) || false;
		const isTotal = await Courses.total(isList) || false;
		res.render('card', { title: 'Card', isCard: true, isList, isTotal});
	}catch(e){
		console.log(e)
	}
});

router.post('/append', async function(req, res){
	try{
		const { courseID } = req.body;
		const { user } = req.session;
		const index = user.card.items.findIndex( el => el.id === courseID );

		if(index === -1){
			user.card.items.push({ id: courseID, cnt: 1, date: Date.now() });
		}else{
			user.card.items[index].cnt ++ ;
		}

		await User.updateOne({_id: user._id},{card: user.card});

		res.redirect('/card')
	}catch(e){
		console.log(e)
	}
})

router.delete('/', async function(req, res){
	try{
		const { id } = req.query;
		const { user } = req.session;
		const duplicate = JSON.parse(JSON.stringify(user));
		const index = duplicate.card.items.findIndex( el => el.id === id);

		if(duplicate.card.items[index].cnt > 1){
			duplicate.card.items[index].cnt -- ;
		}else if(duplicate.card.items[index].cnt <= 1){
			duplicate.card.items.splice(index,1);
		}

		await User.updateOne({_id: duplicate._id},{card: duplicate.card});
		const transform = await Courses.transform(duplicate.card.items);
		const total = await Courses.total(transform);
		res.json({courses: transform, total})
	}catch(e){
		console.log(e)
	}
})

module.exports = router;
