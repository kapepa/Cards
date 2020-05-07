const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
	nameID: mongoose.Types.ObjectId,
	list: Array,
});

module.exports = mongoose.model('order', orderSchema);