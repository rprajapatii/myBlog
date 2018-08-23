const User = require('../models/user');

module.exports = (router) => {
    router.get('/notifications',(req, res) => {
        User.findOne({_id: res.decoded.userId},(err, user) => {
            if(err) {
                res.json({ success: false, message: err  });
            } else {
                if(!user){
                    res.json({ success: false, message: 'User authentication failed.' })
                }else{
                    const notifications = user.notifications;
                    //  console.log('notifications =', notifications);

                    if(notifications != undefined){
                        res.json({ success: true, notifications: notifications })
                    } else {
                        // console.log('inside no notification');
                        res.json({ success: false, message: 'There is no notification for now.' });
                    }
                }

            }
        });
    });

    router.get('/countNotification',(req, res) => {
        User.findOne({_id: res.decoded.userId},(err, user) => {
            if(err) {
                res.json({ success: false, message: err  });
            } else {
                if(!user){
                    res.json({ success: false, message: 'User authentication failed.' })
                }else{
                    const notifications = user.notifications;
                    // console.log('count notification notifications =', notifications);

                    if(notifications != undefined){
                        const countStat = notifications.filter(x=>x.seen == false);
                        const count = countStat==null?0:countStat.length;
                        // console.log('count =', count);
                        res.json({ success: true, count: count });
                    } else {
                        res.json({ success: false, message: 'There is no notification for now.' });
                    }

                }
            }
        });
    });

    router.put('/updateSeen',(req, res) => {
        console.log(req.body.notifications);
        User.findOneAndUpdate({_id: res.decoded.userId}, {notifications: req.body.notifications}, {upsert:true}, (err, user)=>{
            if (err) {
                res.json({ success: false, error: err });
            }else{
                res.json({ success: true,message:"message has been seen by user"});
            }
        })
    });

    return router;
}