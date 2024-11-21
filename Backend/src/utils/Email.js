const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

class Email {
    constructor(to){
        this.from    = process.env.EMAIL;
        this.to      = to;
        this.subject = 'Falconion'
    };

    async send(msg) {
        try {
            let info = await transporter.sendMail(msg);
            console.log('Email sent: ', info.response);
            return info;
        } catch (error) {
            console.log('Error in Email.js: ', error);
            throw error;
        }
    }

    async verificationEmail(otp){
        const htmlContent = `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="margin-top: 20px;">
        <h3 style="color: #000; font-weight: bold;"Falconion<br></h3>
        <p style="color: #666;">Your verification code is:<br></p>
        <p style="color: #333; font-size: 24px; font-weight: bold;">${otp}</p>
        <p style="color: #666;">valid for only  5  minutes.</p>`

        let send = await this.send({
            from   : process.env.EMAIL,
            to     : this.to,
            subject: this.subject,
            text   : 'Verify your email',
            html   :  htmlContent
        });

        return send;
    }

    async resetPassword(url){
        const htmlContent =  `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="margin-top: 20px;">
        <h3 style="color: #000; font-weight: bold;"Falconion<br></h3>
        <p style="color: #666;">You requested to reset your password.<br></p>
        <p style="color: #666;">Click the link below to reset your password.<br></p>
        <a href="${url}">${url}</a>
        <p style="color: #666;">valid for only  10  minutes.</p>`;

        return await this.send({
            from   : this.from,
            to     : this.to,
            subject: this.subject,
            text   : 'Reset your password',
            html   : htmlContent
        });
    }
}

module.exports = Email;
