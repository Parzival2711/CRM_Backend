const jwt = require('jsonwebtoken');
//Checks if token is valid / not
exports.isTokenValid = function(req,res,next){
    if(req.headers && req.headers.authorization){
        const auth = req.headers.authorization.split(' ');
        console.log(auth);
        if(auth[0]==='JWT'){
            jwt.verify(auth[1],'RESTFULAPIs',function(err,decode)  {
                if(err){
                    req.user = undefined;
                    next();
                }
                else{
                    req.user = decode;
                    console.log(decode);
                    next();
                }
            });
        }
        else{
            req.user = undefined;
            next();
        }
    }
    else{
        req.user = undefined;
        next();
    }
}
//Checks if login is required
exports.isLoginRequired = function(req,res,next){
    if(req.user){
        next();
    }
    else{
        return res.status(401).json({message:"Unauthorized User!!"});
    }
}
//Retrieves user information
exports.get_profile = function (req,res,next){
    if(req.user){
        res.status(200).send(req.user);
        next();
    }
    else{
        return res.status(401).json({message:'Invalid Token'});
    }
};
