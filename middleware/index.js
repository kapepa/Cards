const Users = require('../module/users');

module.exports = async function( req, res, next ){
	if( req.session.user ) req.session.user = await Users.findOne({_id: req.session.user._id})
	if( req.session.auth ) res.locals.isAuth = req.session.auth;
	res.locals.csrfToken = req.csrfToken();
	next()
}