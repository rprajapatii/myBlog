const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
const auth = require('./routes/auth')(router);
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


app.get('*', function(req, res){
	res.sendFile(path.join(__dirname + '/client/dist/client/index.html'));
});

app.listen(8080, () => {
	console.log('Listening on port 8080');
});