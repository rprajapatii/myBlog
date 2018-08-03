const Blog = require('../models/blog');

module.exports = (router) => {
    router.get('/searchTitle/:title',(req, res) => {
        if( !req.params.title ) {
            res.json({ success: false, message: 'Search text is not provided.' })
        } else {
            Blog.find({title:{$regex: new RegExp(req.params.title)}},(err,blogs) => {
                if(err) {
                    res.json({ success: false, message: err })
                } else {
                    if(!blogs){
                        res.json({ success: false, message: 'There is no Blog with such title.' })
                    } else {
                        res.json({ success: true, blogs: blogs })
                    }
                }
            })
        }
    });

    return router;
}