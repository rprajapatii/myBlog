const User = require('../models/user');
const Blog = require('../models/blog');
const config = require('../config/database');
const jwt = require('jsonwebtoken');

module.exports = (router) => {
	router.post('/newBlog', (req, res) => {
        if( !req.body.title ) {
            res.json({ success: false, message: "You must provide title for the blog." });
        }else{
            if(!req.body.body) {
                res.json({ success: false, message: "You must write body for the blog." });
            }else{
                    if(!req.body.createdBy) {
                        res.json({ success: false, message: "You must provied the name of the writer." });
                    } else {
                    let blog = new Blog({
                        title: req.body.title,
                        body: req.body.body,
                        createdBy: req.body.createdBy 
                    });
                    blog.save((err) => {
                        if(err){
                            if(err.errors){
                                if(err.errors.title){
                                    res.json({
                                        success: false, message: "Title must be more than 5 characters but no more than 50."
                                    })
                                }else{
                                    if(err.errors.body){
                                        res.json({
                                            success: false, message: "Body must be more than 5 characters but no more than 5000."
                                        })
                                    }else {
                                        res.json({ success: false, message: err });
                                    }
                                }   
                            } else {
                                res.json({ success: false, message: err }); 
                              }                
                        }else {
                            res.json({ success: true, message: 'Blog is saved.' });
                        }
                    });
                }
            }
        
        }
    });

    return router;
}