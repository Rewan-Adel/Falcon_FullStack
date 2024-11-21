const axios = require('axios');
const bcrypt = require('bcrypt');
const User = require('../../user/models/user.model');
const  oauth2Client  = require('../../../config/oauth2Client');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const {sendVerifyEmail, resetPasswordEmail} = require('../../../utils/sendCodeToEmail');
const {emailValidation, completeValidation, usernameValidation} = require('../validators/signup.validation');
const {generateToken} = require('../../../middlewares/auth.token');
const {
    serverErrorMessage,
    badRequestMessage
} = require('../../../middlewares/error.messages.middleware');
const {
    passwordValidation
} = require('../../user/validators/profile.validation');

const emailRegisterAPI = async(req, res, next)=>{
    try{
       // let registerWay = req.params.way;
        let  user = await emailRegister(req, res); 


        // switch(registerWay) {
        //     case 'email': 
        //     user = await emailRegister(req, res); 
        //     break;
        //     case 'google': 
        //         return res.redirect(getGoogleAuthURL());                
        //     case 'phone': 
        //         user = await phoneRegister(req, res); 
        //         break;
        //     case 'apple': 
        //         user = await appleRegister(req, res); 
        //         break;
        //     case 'twitter': 
        //         user = await twitterRegister(req, res); 
        //         break;
        //     default:
        //         return badRequestMessage('Invalid register way.', res);
        // };

        if (!user) return badRequestMessage('Registration failed.', res);
        if (typeof user === 'string') {
            if(user =="Couldn't send verification email") return serverErrorMessage(user, res);
        };
        let token = await generateToken(user.userID, res);

        return res.status(201).json({
            status: 'success',
            message: 'Verification code is sent.',
            data: {
                user: user.toJSON(),
                token
            }
        });
    
    }catch(error){
        console.log('Error in auth.controller.js, register function: ',error);
        serverErrorMessage(error, res);
    }
};
const getGoogleAuthURL = (res) =>{
    const scope = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];
    let url = oauth2Client.generateAuthUrl({
      access_type: 'offline', 
      scope,
    });

    return url;
}
const googleRegisterAPI = async(req, res, next)=>{
    try{
        const userInfo = await getGoogleUser(req);

        let user = await User.findOne({where: {email: userInfo.email}});
        // if user exists, login
        if( user ) {
            if(user.registerWay  != "google") return badRequestMessage("email already exist", res);
            let token = await generateToken(user.userID, res);
            return res.status(200).json({
                status: 'success',
                message: 'User logged in successfully.',
                data: {
                    user: user.toJSON(),
                    token
                }
            });
        }
        // if user doesn't exist, register
        user = await User.create({email: userInfo.email,username: userInfo.name, googleToken: userInfo.googleToken, signupWay: "google", isVerified:true});    
        await user.save();

        let token = await generateToken(user.userID, res);
        return res.status(201).json({
            status: 'success',
            message: 'User created successfully.',
            data: {
                user: user.toJSON(),
                token
            }

        });
    }catch(error){
        console.log('Error in googleRegisterAPI function: ',error);
        serverErrorMessage(error, res);
    }
};

const verifyCode = async(req, res, next)=>{
    try{
        let {otp} = req.body;
        let {user} = req;

        if(!otp) return badRequestMessage('Verification code is required.', res);

        otp = otp.toString();
        const isMatch = await bcrypt.compare(otp, user.otp);
        if(!isMatch) return badRequestMessage('Invalid verification code', res);
        
        if(user.otpExpires < Date.now()) return badRequestMessage('Verification code has expired.', res);
        
        await user.update({isVerified: true, otp: null, otpCount: 0, otpExpires: null});

        return res.status(200).json({
            status: 'success',
            message: 'Valid code.',
            data: {
                isVerified: true,
            }
        });
    }catch(error){
        console.log('Error in auth.controller.js: ',error);
        next(serverErrorMessage(error, res));
    }
};
const resendCode = async(req, res, next)=>{
    try{
        let {user} = req;
        if(user.otpCount >= 5){
            setTimeout( function(){
                user.update({
                    otp       : null,
                    otpCount  : 0,
                    otpExpires: null
                })
            }, 10 * 60 * 1000 );

            return badRequestMessage('Verification code limit exceeded. try again after 10 minutes', res)
        };

        await sendVerifyEmail(user);
        
        return res.status(200).json({
            status: 'success',
            message: 'Verification code is sent.',
            data: null
        });
    }catch(error){
        console.log('Error in auth.controller.js: ',error);
        next(serverErrorMessage(error, res));
    }

};

const completeProfile = async(req, res, next)=>{
    try{
        let {user} = req;
        if(!user.isVerified) return badRequestMessage('Please, Verify your account.', res);

        let {error, value} = completeValidation(req.body);
        if(error) return  badRequestMessage(error.message, res);
        
        let checkUsername = await User.findOne({
            where: {
                username: value.username
            }
        });

        if(checkUsername) return badRequestMessage("username already exists", res);
        value.password = await bcrypt.hash(value.password, 10);
        await user.update(value);
        

        return res.status(200).json({
            status: 'success',
            message: 'Profile has been completed.',
            data:{
                user: user.toJSON()
            }
        });

    }catch(error){
        console.log('Error in auth.controller.js: ',error);
        next(serverErrorMessage(error, res));
    }
};
const createUsername = async(req, res, next)=>{
    try{
        let {error, value} = usernameValidation(req.body);
        if(error) return badRequestMessage(error.message, res);

        let {user} = req;
        let checkUsername = await User.findOne({
            where: {
                username: value.username
            }
        });
        if(checkUsername) return badRequestMessage("username already exists", res);

        await user.update(value);
        return res.status(200).json({
            status: 'success',
            message: 'Username has been created.',
            data:{
                user: user.toJSON()
            }        });
    }
    catch(error){
        console.log('Error in auth.controller.js: ',error);
        next(serverErrorMessage(error, res));
    }
};

const loginByEmail = async(req, res, next)=>{
    try{
        let { error, value } = emailValidation(req.body);
        if(error) return badRequestMessage(error.message, res);

        let user = await User.findOne({where: {email: value.email}});
        if( !user ) return badRequestMessage('Invalid email.', res);
        
        if(user.signupWay  != "email") return badRequestMessage("Invalid.", res);

        //await sendVerifyEmail(user);
        
        let token = await generateToken(user.userID, res);
        res.cookie('jwt', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production' ? true : false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        req.user = user;
        return res.status(200).json({
            status: 'success',
            message: "",
            data:{
                token
            }
        });
}catch(error){
    console.log('Error in auth.controller.js: ',error);
    serverErrorMessage(error, res);
}
};
const loginPass = async(req, res, next)=>{
    try{
        let {password} = req.body;
        if(!password) return badRequestMessage('Password is required.', res);
        
        let token = req.cookies.jwt || req.header('Authorization').replace('Bearer ', '');
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.userID);
        
        if(!user) return badRequestMessage("Invalid token", res);
        let checkPass = await bcrypt.compare(password, user.password);  

        if(!checkPass) return badRequestMessage("Invalid Password", res);

        return res.status(200).json({
            status: 'success',
            message: 'Login successful.',
            data: null
        });
    
}catch(error){
    console.log('Error in auth.controller.js: ',error);
    serverErrorMessage(error, res);
}
};
const logout = async(req, res, next)=>{
    try{
        let {user} = req;
        if(user.googleToken ){
            await oauth2Client.revokeToken(user.googleToken);
            user.googleToken = null;
            await user.save();
        }
        res.clearCookie('jwt');
        return res.status(200).json({
            status: 'success',
            message: 'Logout successfully.',
            data: null
        });
    }catch(error){
        console.log('Error in auth.controller.js: ',error);
        serverErrorMessage(error, res);
    }
};

const  forgotPassword = async(req, res, next)=>{  
    try{
        let {email} =  req.body;
        if(!email) return badRequestMessage('Email is required.', res);
        let user = await User.findOne({
            where:{
                email 
            }
            });
        if(! user) return badRequestMessage("Invalid email", res);
    
        let token = crypto.randomBytes(32).toString('hex');
        let url = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${token}`;
        
        user.passResetToken = token;
        user.passResetExpires = Date.now() + 3 * 60 * 1000; // 10 minutes

        setTimeout( async()=>{
            user.passResetToken = null;
            user.passResetExpires = null; // 10 minutes
            await user.save();
       }, 3 * 60 * 1000);
        
        
        await resetPasswordEmail(user, url);

        return res.status(200).json({
            status: 'success',
            message: 'Reset password link is sent to your email.',
            data : null
        })
    }catch(error){
        console.log('Error in auth.controller.js: ',error);
        serverErrorMessage(error, res);
    }
};
const resetPassword = async(req, res, next)=>{
    try{
        const { token } = req.params;
        const user = await User.findOne({
            where: {
                passResetToken: token,
            }
        });
        if (!user) return badRequestMessage("Invalid token or expired.", res);
        

        let {value,error} = passwordValidation(req.body);
        if(error) return badRequestMessage(error.message, res);
        
        const checkPass = await bcrypt.compare(value.newPassword, user.password);
        if(checkPass) return badRequestMessage('New password must be different from old password', res);
        

        let hashedPass = await bcrypt.hash(value.newPassword, 10);
        user.password = hashedPass; 
        user.passResetToken = null;
        user.passResetExpires = null;
        user.passChangedAt = Date.now();
        await user.save();

        return res.status(200).json({
            status: 'success',
            message: 'Password reset successfully.',
            data: null
        });
    }catch(error){ 
        console.log('Error in auth.controller.js: ',error);
        serverErrorMessage(error, res);
    }
};

async function emailRegister(req, res){
    let { error, value } = emailValidation(req.body);
    if(error) return error.message;

    try{
        let user = await User.findOne({where: {email: value.email}});
        if( user ) return 'Email already exists';

        user = await User.create(value);
        user.signupWay = 'email';
        await user.save();
        let sendMil = await sendVerifyEmail(user);
    
        if(!sendMil) {
            await user.destroy();
            return "Couldn't send verification email";
        }
        return user;
    }catch(error){
        console.log('Error in emailRegister function: ',error);
        throw new Error(error.message);
    }
};
async function getGoogleUser(req) {
    try {
        const { code } = req.query;
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials({ refresh_token: tokens.refresh_token });

        const response = await axios.get(
                `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
                {
                    headers: {
                        Authorization: `Bearer ${tokens.access_token}`,
                    },
                }
        );

        const { email, name } = response.data;
        let googleToken = tokens.access_token;

        return { email, name , googleToken};
    }catch (error) {
        throw new Error(`Failed to fetch Google user: ${error.message}`);
    }
};

module.exports = {
    emailRegisterAPI,
    getGoogleAuthURL,
    googleRegisterAPI,
    verifyCode,
    completeProfile,
    createUsername,
    resendCode,
    loginByEmail,
    loginPass,
    resetPassword,
    forgotPassword,
    logout
};