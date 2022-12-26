const User = require('../models/user.model');
const constants = require('../utils/constants');
const ObjectConverter = require('../utils/ObjectConverter');
const bcrypt = require('bcrypt');
//Fetching users based on usertype,userstatus
exports.getUsers = async(req,res)=>{
    //Filter
    let userTypequery = req.query.userType;
    let userStatusquery = req.query.userStatus;

    //logic to fetch
    var users;
    if(userTypequery){
        try{
            users = await User.find({userType:userTypequery});
        }
        catch(err){
            console.log("Error while fetching data for : ",userTypequery);
            res.status(500).send({
                message:"Some internal error occured."
            })
        }
    }
    else if(userTypequery && userStatusquery){
        try{
            users = await User.find({
                userType:userTypequery,
                userStatus:userStatusquery
            });
        }
        catch(err){
            console.log("Error while fetching data for : ",userTypequery," & ",userStatusquery);
            res.status(500).send({
                message:"Some internal error occured."
            })
        }
    }
    else if(userStatusquery){
        try{
            users = await User.find({
                userStatus:userStatusquery
            });
        }
        catch(err){
            console.log("Error while fetching data for : ",userStatusquery);
            res.status(500).send({
                message:"Some internal error occured."
            })
        }
    }
    res.status(200).send(ObjectConverter.userResponse(users));
}
//update userType,userStatus & email of any user
exports.adminUpdate = async(req,res)=>{
    let userIdparam = req.params.userId;
    let req_status = req.body.userStatus;
    let req_email = req.body.email;
    console.log(userIdparam);
    //Approving an user
    try{
        var user = await User.findOneAndUpdate({
            userId:userIdparam
        },{
            userStatus:req_status,
            email:req_email
        }
        );
        console.log(user);
        res.status(200).send({
            message:"Data has been updated successfully"
        });
    }
    catch(err){
        console.log("Update failed for : ",userIdparam);
        res.status(500).send({
            message:"Some Internal error occurred"
        });
    }
}
//Individual user's update handler for updating personal fields
exports.userUpdate = async(req,res)=>{
    let newPassword = bcrypt.hashSync(req.body.password,10);
    let newContact = req.body.contact;
    try{
        let updatedUser = await User.findOneAndUpdate({
            userId:req.user.userId
        },{
            password:newPassword,
            contact:newContact
        })
        res.status(200).send({
            message:"Data has been updated successfully"
        })
    }catch(err){
        console.log("Data Couldn't be updated");
        res.status(500).send({
            message:"Some Internal error occurred"
        });
    }
}
