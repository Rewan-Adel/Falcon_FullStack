const Email = require('./Email');
const bcrypt = require('bcrypt');

exports.sendVerifyEmail = async(user)=>{
    try{
        let otp = generateCode();
        await sendMail(user.email, otp);

        let hashedOtp = await bcrypt.hashSync(otp, 10);
        await updateUserOtp(user, hashedOtp);
        return true;
    }catch(error){
        console.error(error);
    }
};

exports.sendVerifyEmailToChange = async(user, newEmail)=>{
    try{
        let otp = generateCode();
        await sendMail(newEmail, otp);

        let hashedOtp = await bcrypt.hashSync(otp, 10);
        await await user.update({
            otp: hashedOtp,
            otpCount: user.otpCount + 1,
        });
        return true;
    }catch(error){
        console.error(error);
    }
};

exports.resetPasswordEmail = async(user, url)=>{
    try{
        let otp = generateCode();
        await sendResetPassMail(user.email, url);

        let hashedOtp = await bcrypt.hashSync(otp, 10);
        await updateUserPass(user, hashedOtp);

    }catch(error){
        console.error(error);
    }
};
const sendResetPassMail = async(email, url)=>{
    let sendMail = new Email(email);
    await sendMail.resetPassword(url);
}

const generateCode = () => {   
    const otp = Math.floor( Math.random() * 900000);
    return otp.toString();
}

const sendMail = async(email, otp)=>{
    let sendMail = new Email(email);
    await sendMail.verificationEmail(otp);
};


const updateUserOtp = async(user, hashedOtp)=>{
    await user.update({
        otp: hashedOtp,
        otpCount: user.otpCount + 1,
        otpExpires: new Date(Date.now() + 5 * 60 * 1000)
    });

    await user.save();

};

const updateUserPass = async(user, hashedPass)=>{
    await user.update({
        password        : hashedPass,
        confirmPassword : undefined,
        passChangedAt   : Date.now(),
        passResetToken  : undefined,
        passResetExpires: undefined
    });

    await user.save();
};
