const User = require('../models/user.model');
const constants = require('../utils/constants');

//Middleware to check if user is Admin / Not
exports.isAdmin = async(req,res,next)=>{
    console.log(req.user.userId);
    const user = await User.findOne({userId:req.user.userId});
    console.log(user);
    if(user && user.userType == constants.userTypes.admin){
        next();
    }
    else{
        res.status(403).send({
            message : "You're not authorized. Please contact Admin"
        });
        return;
    }
};
//Validate the body of the update request
exports.validateUpdate = async(req,res,next)=>{
    if(req.url.includes("admin")){
        if(req.body.password || req.body.contact){
            res.status(500).send({
                message:"Personal data fields should be updated by user"
            })
            return;
        }
    }
    else if(req.url.includes("user")){
        if(req.body.userType || req.body.userStatus || req.body.email){
            res.status(500).send({
                message:"Only personal field updations allowed.Please contact admin for rest."
            })
            return;
        }
    }
    next();
}
