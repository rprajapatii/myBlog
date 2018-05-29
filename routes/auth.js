const User = require('../models/user'); 

module.exports = (router) => {
	router.post('/register', (req, res) => {
		if(!req.body.email){
			res.json({ success: false, message: "You must provide a valid email" });
		}else{
			if(!req.body.username){
				res.json({ success: false, message: "You must provide a valid username" });
			}else{
				if(!req.body.password){
				res.json({ success: false, message: "You must provide a valid password" });
				}else{
					let user = new User({
						email: req.body.email.toLowerCase(),
						username: req.body.username.toLowerCase(),
						password: req.body.password
					});
					user.save((err)=> {
						if(err){
							if(err.code === 11000){
								res.json({
									success: false, message: "Username or Email already exists."
								})
							}else{
								if(err.errors.email){
									res.json({
										success: false, message: err.errors.email.message
									})
								}else{
									if(err.errors.password){
										res.json({
											success: false, message: err.errors.password.message
										})
									}else{
										res.json({ 
											success: false, message: "Unable to save user. Error:", err 
										});
									}
								}		
							}
						}else{
							console.log(req.body);
							res.json({
								success: true, message: "You are successfully registered!"
							});
						}
					});
				}
			}
		}
	});

	return router;
}