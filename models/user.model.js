const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    userId : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        lowercase : true,
        unique : true,
        validate : {
            validator : function(mail){
                var regex_pattern = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9+_.-]+$/;
                return regex_pattern.test(mail);
            },
            message : 'Invalid Email ID'
        }
    },
    contact : {
        type : String
    },
    createdAt : {
        type : Date,
        immutable : true,
        default : ()=>{
            return Date.now();
        }
    },
    updatedAt : {
        type : Date,
        default : ()=>{
            return Date.now();
        }
    },
    userType : {
        type : String,
        required : true,
        default : "CUSTOMER"
    },
    userStatus : {
        type : String,
        required : true,
        default : "APPROVED"
    }
})
userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password,this.password);
};
userSchema.plugin(uniqueValidator,{type:'mongoose-unique-validator'});
module.exports = mongoose.model("User",userSchema);
