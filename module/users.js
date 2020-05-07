const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
	name: String,
	email: String,
	password: String,
	card: Object,
	avatar: String,
	token: String,
	expireToken: String,
});

module.exports = mongoose.model('users', usersSchema);