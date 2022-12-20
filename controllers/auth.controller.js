const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const constants = require('../utils/constants');

//Handler for Sign Up
exports.sign_up = async(req,res)=>{
    var userStatus = req.body.userStatus;
    if(!req.body.userStatus){
        
    }
}
