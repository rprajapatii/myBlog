const User = require('../models/user');
const Blog = require('../models/blog'); 

module.exports = {
    likenotify: (likedBy, blogId, blogTitle, blogCreator) => {
        if(blogTitle.length > 30){
            blogTitle = blogTitle.slice(0,50) + "...";
        }
        
        notification = likedBy + ' ' + 'has recently liked your blog' + ' ' + "" + blogTitle + "";
        
        User.findOne({username: blogCreator},(err, user) => {
            if(err){
                res.json({ success: false, message: err })
            }else{
                const notifications = user.notifications?user.notifications:[];

                notifications.push({
                    blogId: blogId,
                    notification: notification,
                    seen: 0,
                    timestamp:Date.now()
                });

                User.findOneAndUpdate({username: blogCreator}, {notifications: notifications}, {upsert:true}, (err, user)=>{
                    if (err) { 
                        console.log("error:", err) 
                    }else{
                        console.log("succesfully saved") 
                    }
                }).sort({ '_id': -1 });
            }
        });
    },

    dislikenotify: (dislikedBy, blogId, blogTitle, blogCreator) => {
        if(blogTitle.length > 30){
            blogTitle = blogTitle.slice(0,50) + "...";
        }
        
        notification = dislikedBy + ' ' + 'has recently disliked your blog: ' + ' ' + "" + blogTitle + "";
        
        User.findOne({username: blogCreator},(err, user) => {
            if(err){
                res.json({ success: false, message: err })
            }else{
                const notifications = user.notifications?user.notifications:[];
                
                notifications.push({
                    blogId: blogId,
                    notification: notification,
                    seen: 0,
                    timestamp:Date.now()
                });


                User.findOneAndUpdate({username: blogCreator}, {notifications: notifications}, {upsert:true}, (err, user)=>{
                    if (err) { 
                        console.log("error:", err) 
                    }else{
                        console.log("succesfully saved") 
                    }
                }).sort({ '_id': -1 });
            }
        });
    }
}

