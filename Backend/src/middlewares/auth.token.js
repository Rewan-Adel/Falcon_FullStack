const jwt = require('jsonwebtoken');
const User = require('../modules/user/models/user.model');
const { serverErrorMessage,unAuthorizedMessage, notFoundMessage } = require('./error.messages.middleware');

const protect = async(req, res, nxt)=>{
    try{
        let token;
        if( 
            req.header('Authorization')  &&
            req.header('Authorization').startsWith('Bearer ')
        ) 
            token = req.header('Authorization').replace('Bearer ', '');
        
        else if(req.cookies.jwt) 
            token = req.cookies.jwt;
        
        if(!token) return unAuthorizedMessage('Please login for get access', res);


        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.userID);
        if(!user) return notFoundMessage("Invalid token", res);

        // Check if user changed password after token was issued
        let passChangedAt;
        if (user.passwordChangedAt) 
        passChangedAt = parseInt(user.passwordChangedAt.getTime() / 1000, 10);

        if(passChangedAt > decoded.iat) return unAuthorizedMessage('User recently changed password. Please login again.', res);
        //if(user.passResetExpires >  Date.now()) return unAuthorizedMessage('User recently requested for password reset. Please login again.', res);
        // if(user.otpExpires >  Date.now()) return unAuthorizedMessage('User recently requested for OTP. Please login again.', res);
        
        req.token = token;
        req.user  = user;
        nxt();
    }
    catch(error){
        console.log('Error at token.middleware file: ', error);
       // serverErrorMessage(error, res);
    }
};

const checkVerification = async(req, res, nxt)=>{
    try{
        if(req.user.isVerified === false) return unAuthorizedMessage('User is not verified. Please verify your email.', res);
        nxt();
    }
    catch(error){
        console.log('Error at token.middleware file: ', error);
    }
};

const restrictTo = (...roles)=>{
    return (req, res, nxt)=>{
        if(!roles.includes(req.user.role)) return unAuthorizedMessage('Unauthorized!', res);
        nxt();
    };
}; // Implement this function to restrict access to certain routes

const generateToken = async(userID, res)=>{
    try{
        const token = jwt.sign({userID}, process.env.JWT_SECRET, {expiresIn: '90d'});
        res.cookie('jwt', token,{
            httpOnly: true,
            sameSite : 'strict', // csrf protection
            secure: process.env.NODE_ENV === 'production' ? true : false, 
            maxAge:  7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return token;
    }
    catch(error){
        console.log('Error at token.middleware file: ', error);
    }
};


module.exports = {
    protect, 
    restrictTo,
    checkVerification,
    generateToken
};  