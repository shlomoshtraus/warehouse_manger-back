import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'warehousestaffinfo',
        pass: process.env.EMAIL_PASSWORD
    }
});

export async function sendEmail(email: string, username: string, mailOptions: any, link: string): Promise<boolean> {
    try {
        await transporter.sendMail(mailOptions);
        return true
    } catch (e) {
        return false;
    }
}

export function generateConfirmationBodyMail(email: string, username: string,link:string): { to:string,subject: string; text: string } {
    const mailOptions = {
        to: email,
        subject: 'Thank you for registering to our website',
        text: `
         Hello ${username}!
         Thank you for registering to our website.
         Please click on the link below to verify your email address.
         Verify your email address: ${link}
        `
    };
        return mailOptions;
}

export function generateRequestPasswordBodyMail(email: string, username: string,link:string): { to:string,subject: string; text: string } {
    const mailOptions = {
        to: email,
        subject: 'password reset link',
        text: `
         Hello ${username}!
         As you requested, here is the link to reset your password. 
         Please click on the link below to reset your password.
         Reset your password link: ${link}
        `
    };
        return mailOptions;
}
