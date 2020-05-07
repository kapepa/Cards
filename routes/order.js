const express = require('express');
const router = express.Router();
const Order = require('../module/order');
const User = require('../module/users');
const Course = require('../module/courses');

router.get('/', async function(req, res, next) {
	try{
		const { user } = req.session;
		const transform = await Course.transform(user.card.old) || false;
		res.render('order', { title: 'Order', isOrder: true, isList: transform });
	}catch(e){
		console.log(e)
	}
});

router.get('/done', async function(req, res){
	try{
		const { user } = req.session;
		const duplicate = JSON.parse(JSON.stringify(user));
		await Order({nameID: user._id, list: user.card.items}).save()
		duplicate.card.items = [];
		duplicate.card.old = user.card.items;
		await User.updateOne({_id: user._id},{card: duplicate.card});
		res.redirect("/order")
	}catch(e){
		console.log(e)
	}
});

module.exports = router;
