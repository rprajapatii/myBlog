const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const bcrypt = require('bcrypt-nodejs');

let emailLengthChecker = (email) => {
	if(!email){
		return false;
	}else{
		if(email.length < 6 || email.length > 30){
			return false;
		}else{
			return true;
		}
	}
}

let validEmailChecker = (email) => {
	if (!email) {
		return false;
	}else{
		const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
		return regExp.test(email);
	}
	
}

const emailValidator = [
	{	
		validator: emailLengthChecker, 
		message: "Email must be at least 6 character long but no more than 30."
	},

	{
		validator: validEmailChecker,
		message: "Email must be a valid."
	}

]


let usernameLengthChecker = (username) => {
	if(!username){
		return false;
	}else{
		if(username.length < 3 || userSchema.length > 20){
			return false;
		}else{
			return true;
		}
	}
}

let validUsernameChecker = (username) => {
	if (!username) {
		return false;
	}else{
		const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
		return regExp.test(username);
	}
	
}

const usernameValidator = [
	{	
		validator: usernameLengthChecker, 
		message: "Username must be at least 3 character long but no more than 20."
	},

	{
		validator: validUsernameChecker,
		message: "Username must not have any special characters."
	}
]

let passwordLengthChecker = (password) => {
	if (!password){
		return false;
	}else{
		if(password.length < 8 || password.length > 25){
			return false;
		}else{
		return true;
		}
	}
}

let passwordChecker = (password) => {
	if (!password){
		return false;
	}else{
		const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,25}$/);
		return regExp.test(password);
	}
}

const passwordValidator = [
	{
		validator: passwordLengthChecker,
		message: "Password should be at least 8 character long but not more than 25"
	},
	{
		validator: passwordChecker,
		message: "Password must have at least one uppercase, lowercase, special character, and number"
	}
]


const userSchema = new Schema({
	email: { type: String, required: true, unique: true, lowercase: true, 
			validate: emailValidator },
	username: { type: String, require: true, unique: true, lowercase: true, 
				validate: usernameValidator },
	password: { type: String, require: true,
					validate: passwordValidator },
notifications: [{
			blogId: {
				type: String
			},
			notification: {
				type: String
			},
			seen: {
				type: Boolean
			},
			timestamp: {
				type: String
			  },

		}]
});


// Schema Middleware to Encrypt Password
userSchema.pre('save', function(next) {
	if(!this.isModified('password'))
		return next();

	bcrypt.hash(this.password, null, null, (err, hash) =>{
    	if(err) return next(err);
    	this.password = hash;
    	next();
	});
});

userSchema.methods.comparePassword = function(password) {
	return bcrypt.compareSync(password, this.password);
  };

module.exports = mongoose.model('User', userSchema);