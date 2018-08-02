const Category = require('../models/category');
const Blog = require('../models/blog');
const config = require('../config/database');

module.exports = (router) => {
	router.post('/category', (req, res) => {
            if( !req.body.name ) {
                res.json({ success: false, message: "You must provide category name." });
            }else{
                let category = new Category({
                name: req.body.name
            });

            category.save((err) => {
                if(err){
                    res.json({ success: false, message: err }); 
                }else{
                    res.json({ success: true, message: 'Category is saved.' });
                }
            });
        }
    });

    router.get('/categories',(req, res) => {
        Category.find({},(err, categories) => {
            if(err) {
                res.json({ success: false, message: err })
            } else {
                if(!categories){
                    res.json({ success: false, message: 'There are no Categories.' })
                } else {
                    res.json({ success: true, categories: categories });
                }
            }
        })
    });

    router.post('/addCategory/:catName',(req, res) => { 
        if (!req.params.catName) {
            res.json({ success: false, message: 'Category name for the blog was not provided.' });
          } else {
            Category.findOne({ name: req.params.catName }, (err, category) => {
                console.log('category =', req.params.catName);
              if (err) {
                res.json({ success: false, message: err });
              } else {
                if (category) {
                  res.json({ success: false, message: 'Category already exist. No need to add.' });
                } else {
                    let category = new Category({
                        name: req.params.catName
                    });

                    category.save((err) => {
                        if(err){
                            res.json({ success: false, message: err }); 
                        }else{
                            res.json({ success: true, message: 'Category is added.' });
                        }
                    });
                }
              }
            });
          }
    });

    router.get('/categoryBlogs/:catName',(req, res) => {
        if (!req.params.catName) {
            res.json({ success: false, message: 'Category name for the blog was not provided.' });
        } else {
            Blog.find({category: req.params.catName}, (err,blogs) => {
                if(err){
                    res.json({ success: false, message: err })
                } else {
                    res.json({ success: true, blogs: blogs })
                }
            })  
        }
    });

    router.put('/updateCategory',(req, res) => {
        
    });

    return router;
}