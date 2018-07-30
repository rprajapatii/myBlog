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

    router.get('/getAllBlogs',(req, res) => {
        // res.send('test');
        Blog.find({},(err, blogs) => {
            if(err) {
                res.json({ success: false, message: err })
            } else {
                if(!blogs){
                    res.json({ success: false, message: 'There is no Blog.' })
                } else {
                    res.json({ success: true, blogs: blogs });
                }
            }
        }).sort({ '_id': -1 })
    });

    router.get('/singleBlog/:id',(req, res) => {
        // res.send('test');
        if(!req.params.id) {
            res.json({ success: false, message: 'No blog id is provied.' })
        } else {
            Blog.findOne({_id: req.params.id}, (err,blog) => {
                if(err){
                    res.json({ success: false, message: 'Valid blog id is not provied.' })
                } else {
                    res.json({ success: true, blog: blog })
                }
            })  
        }
    });

    router.put('/updateBlog',(req, res) => {
        // res.send(req.body._id);
        if(!req.body._id){
            res.json({ success: false, message: 'No blog id is provided.' })
        } else {
            Blog.findOne({_id: req.body._id}, (err, blog) => {
                if(err) {
                    res.json({ success: false, message: 'Blog id is not valid.' })
                }else {
                    if(!blog){
                        res.json({ success: false, message: 'Blog id was not found.'})
                    } else {
                        User.findOne({ _id: res.decoded.userId },(err, user) => {
                            if(err) {
                                res.json({ success:false, message: 'You are not an authorized user.' })
                            } else {
                                if( user.username !== blog.createdBy ) {
                                    res.json({ success: false, message:'Only the user who created the blog can update.' })
                                } else {
                                    blog.title = req.body.title;
                                    blog.body = req.body.body;
                                    blog.save((err) => {
                                        if(err) {
                                            res.json({ success: false, message: err })
                                        } else {
                                            res.json({ success: true, message: 'Blog Updated!' })
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
            })
        }
    }); 

    router.delete('/deleteBlog/:id',(req,res) => {
        if( !req.params.id ) {
            res.json({ success: false, message: 'Blog id is not provided.' })
        } else {
            Blog.findOne({_id: req.params.id},(err,blog) => {
                if(err) {
                    res.json({ success: false, message: 'Blog id is not valid.' })
                } else {
                    if (!blog) {
                        res.json({ success: false, message: 'Blog is not found.' })
                    } else {
                        User.findOne({_id: res.decoded.userId},(err, user) => {
                            if(err) {
                                res.json({ success: false, message: err  });
                            } else {
                                if(!user){
                                    res.json({ success: false, message: 'User authentication failed.' })
                                }else{
                                    if( user.username !== blog.createdBy ){
                                        res.json({ success: false, message: 'You are not authorized to delete this blog.' })
                                    } else{
                                        blog.remove((err) => {
                                            if(err) {
                                                res.json({ success: false, message: err })
                                            }else{
                                                res.json({ success: true, message: 'Blog is deleted.' })
                                            }
                                        })
                                    }
                                }
                            }
                        })
                    }
                }
            });
        }
    });

    router.get('/viewBlog/:id',(req, res) => {
        if( !req.params.id ) {
            res.json({ success: false, message: 'Blog id is not provided.' })
        } else {
            Blog.findOne({_id: req.params.id},(err,blog) => {
                if(err) {
                    res.json({ success: false, message: 'Blog id is not valid.' })
                } else {
                    if (!blog) {
                        res.json({ success: false, message: 'Blog is not found.' })
                    } else {
                        res.json({ success: true, blog: blog })
                    }
                }
            });
        }
    });

    router.put('/likeBlog',(req,res) => {
        if ( !req.body.id ) {
            res.json({ success: false, message: 'Blog id is not provied.' });
        } else {
            Blog.findOne({ _id: req.body.id },(err,blog) => {
                if (err) {
                    res.json({ success: false, message: 'Blog id is not valid.' })
                } else {
                    if(!blog){
                        res.json({ success: false, message: 'Blog is not found.' })
                    } else {
                        User.findOne({_id: res.decoded.userId},(err, user) => {
                            if(err) {
                                res.json({ success: false, message: err  });
                            } else {
                                if(!user){
                                    res.json({ success: false, message: 'User authentication failed.' })
                                }else{
                                    if( user.username === blog.createdBy ){
                                        res.json({ success: false, message: 'You can not like your own blog.' })
                                    }else{
                                        if(blog.likedBy.includes(user.username)){
                                            res.json({ success: false, message: 'You can not like the blog more than once.' })
                                        } else{
                                            if (blog.dislikedBy.includes(user.username)) {
                                               blog.dislikes--;
                                               const indofdisliker = blog.dislikedBy.indexOf(user.username);
                                               blog.dislikedBy.splice(indofdisliker,1);
                                               blog.likes++;
                                               blog.likedBy.push(user.username);
                                               blog.save((err) => {
                                                    if(err){
                                                        res.json({ success: false, message: 'Something went wrong.' })
                                                    }else{
                                                        res.json({ success: true, message: 'Blog liked!' })
                                                    }
                                                })
                                            } else {
                                                blog.likes++;
                                                blog.likedBy.push(user.username);
                                                blog.save((err) => {
                                                    if(err){
                                                        res.json({ success: false, message: 'Something went wrong.' })
                                                    }else{
                                                        res.json({ success: true, message: 'Blog liked!' })
                                                    }
                                                })
                                            }
                                    
                                        }
                                    }
                                }
                            }
                        })
                    }
                }
            })
        }
    });

    router.put('/dislikeBlog',(req,res) => {
        if ( !req.body.id ) {
            res.json({ success: false, message: 'Blog id is not provied.' });
        } else {
            Blog.findOne({ _id: req.body.id },(err,blog) => {
                if (err) {
                    res.json({ success: false, message: 'Blog id is not valid.' })
                } else {
                    if(!blog){
                        res.json({ success: false, message: 'Blog is not found.' })
                    } else {
                        User.findOne({_id: res.decoded.userId},(err, user) => {
                            if(err) {
                                res.json({ success: false, message: err  });
                            } else {
                                if(!user){
                                    res.json({ success: false, message: 'User authentication failed.' })
                                }else{
                                    if( user.username === blog.createdBy ){
                                        res.json({ success: false, message: 'You can not dislike your own blog.' })
                                    }else{
                                        if(blog.dislikedBy.includes(user.username)){
                                            res.json({ success: false, message: 'You can not dislike the blog more than once.' })
                                        } else{
                                            if (blog.likedBy.includes(user.username)) {
                                               blog.likes--;
                                               const indofliker = blog.likedBy.indexOf(user.username);
                                               blog.likedBy.splice(indofliker,1);
                                               blog.dislikes++;
                                               blog.dislikedBy.push(user.username);
                                               blog.save((err) => {
                                                  
                                                    if(err){ 
                                                        res.json({ success: false, message: 'Something went wrong.' })
                                                    }else{
                                                       
                                                        res.json({ success: true, message: 'Blog disliked!' })
                                                    }
                                                })
                                            } else {
                                                blog.dislikes++;
                                                blog.dislikedBy.push(user.username);
                                                blog.save((err) => {
                                                    if(err){
                                                        res.json({ success: false, message: 'Something went wrong.' })
                                                    }else{
                                                        res.json({ success: true, message: 'Blog disliked!' })
                                                    }
                                                })
                                            }
                                    
                                        }
                                    }
                                }
                            }
                        })
                    }
                }
            })
        }
    });

    router.put('/comment',(req,res) => {
        if(!req.body.comment){
            res.json({ success: false, message: 'Comment is not provided.' })
        }else{
            if(!req.body.id){
                res.json({ success: false, message: 'Blog id is not provided.' })
            }else{
                Blog.findOne({_id: req.body.id},(err,blog) => {
                    if(err){
                        res.json({ success: false, message: 'Blod id is not valid.' })
                    }else{
                        if(!blog){
                            res.json({ success: false, message: 'Blog is not found.' })
                        } else{
                            User.findOne({_id: res.decoded.userId},(err,user) => {
                              if(err){
                                res.json({ success: false, message: err })
                              }else{
                                if(!user){
                                    res.json({ success:false, message: 'User not found.' })
                                }else{
                                    blog.comments.push({
                                        comment: req.body.comment,
                                        commentator: user.username
                                    });
                                    blog.save(err => {
                                        if(err){
                                           res.json({ success:false, message: 'Something went wrong.' }) 
                                        }else{
                                            res.json({ success: true, message: 'Comment Saved!' })
                                        }
                                    })
                                }
                              }
                            })
                        }
                    }
                })
            }
            
        }
    });

    router.get('/getUserBlogs',(req, res) => {
        User.findOne({ _id: res.decoded.userId },(err, user) => {
            if(err) {
                res.json({ success: false, message: 'User id is not valid.' })
            }else {
                Blog.find({},(err, blogs) => {
                    if(err) {
                        res.json({ success: false, message: err })
                    } else {
                        if(!blogs){
                            res.json({ success: false, message: 'There is no Blog.' })
                        } else {
                            var result = blogs.filter(obj => {
                                return obj.createdBy === user.username;
                              })
                            res.json({ success: true, blogs: result })
                        }
                    }
                }).sort({ '_id': -1 })
            }
        });
    });

    return router;
}
