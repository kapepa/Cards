const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const coursesSchema = new Schema({
	name: String,
	price: Number,
	url: String,
	userID: mongoose.Types.ObjectId,
});

coursesSchema.static("transform",async function(arr){
	const newArr = new Array();
	if(!arr.length) return false
	for(let key of arr){
		const course = await this.findById(key.id);
		newArr.push({...key, name: course.name, price: course.price})
	}
	return newArr
});

coursesSchema.static("total", function(arr){
	if(!arr) return false;
	return arr.reduce((total, el) => {
		return total + el.price * el.cnt;
	},0)
});

module.exports = mongoose.model('courses', coursesSchema);