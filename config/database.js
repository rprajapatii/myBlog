const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
	uri: 'mongodb://localhost:27017/myBlog_db',
	secret: crypto,
	db: 'myBlog_db'
}