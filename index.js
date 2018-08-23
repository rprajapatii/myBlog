const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
const auth = require('./routes/auth')(router);
const blogs = require('./routes/blogs')(router);
const category = require('./routes/category')(router);
const search = require('./routes/search')(router);
const notification = require('./routes/notification')(router);
const config = require('./config/database');
const bodyParser = require('body-parser');

const cors = require('cors');


mongoose.Promise = global.Promise;

mongoose.connect(config.uri, (err) => {
	if (err) {
		console.log('Could not connect to database:' + err);
	}else{
		console.log('Connected to database:' + config.db );
	}
});

app.use(cors({
	origin: 'http://localhost:4200'
}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.use(express.static(__dirname + '/client/dist/client'));
 
app.use('/auth', auth);
app.use('/blogs', blogs);
app.use('/search', search);
app.use('/category', category);
app.use('/notification', notification);

app.get('*', function(req, res){
	res.sendFile(path.join(__dirname + '/client/dist/client/index.html'));
});

app.listen(8080, () => {
	console.log('Listening on port 8080');
});