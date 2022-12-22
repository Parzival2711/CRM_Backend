const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const constants = require('../utils/constants');
const jwt = require('jsonwebtoken');

//Handler for Sign Up / Registration / Creation of new account
exports.sign_up = async(req,res)=>{
    var newUser = new User(req.body);
    newUser.password = bcrypt.hashSync(req.body.password,10);
    console.log(newUser);
    if(newUser.userId[0]=='A'){
        newUser.userType = constants.userTypes.admin;
        newUser.userStatus = constants.userStatus.approved;
    }else if(newUser.userId[0]=='E'){
        newUser.userType = constants.userTypes.engineer;
        newUser.userStatus = constants.userStatus.pending;
    }
    newUser.save(function(err,user){
        if(err){
            console.log(err);
            res.status(400).send(err.message);
        }
        else{
            return res.json(user);
        }
    });
}

//Handles sign_in feature
exports.sign_in = async function(req,res){
    const filter = {email:req.body.email};
    const result = await User.findOne(filter);
    if(result!= null){
        const pwd_check = result.comparePassword(req.body.password);
        if(pwd_check == true){
            if(result.userStatus==constants.userStatus.approved){
                return res.status(200).json({token : jwt.sign({email:result.email, userId:result.userId, _id:result._id}, 'RESTFULAPIs')});
            }
            else{
                return res.status(401).send("Unable to Sign in.Account is not approved yet.");
            }
            
        }
        else{
            return res.status(401).send("Invalid Password");
        }
    }
    else{
        return res.status(401).send("Invalid Email");
    }
};

