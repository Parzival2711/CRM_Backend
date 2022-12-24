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