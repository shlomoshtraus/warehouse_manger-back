import {
    usersRepository
} from "../data-source";
import bcrypt from "bcrypt"
import jsonwebtoken from "jsonwebtoken"
import {User} from "../entity/User";
import {QueryFailedError} from "typeorm";
import {
    generateConfirmationLink,
    generateRequestPasswordLink
} from "../utils/linksGenerator";
import {
    generateConfirmationBodyMail,
    generateRequestPasswordBodyMail,
    sendEmail
} from "../utils/emailClient";

const DUPLICATE_KEY_ERROR_CODE = "23505";

export const register = async ({username, email, password}) => {
    username = username.toLowerCase();
    const hashPassword = await bcrypt.hash(password, 10);
    try {
        const user = await usersRepository.save(
            {
                username,
                email,
                password: hashPassword
            }
        )
        const link = generateConfirmationLink(process.env.BACKEND_URL, user.id);
        const mailOptions = generateConfirmationBodyMail(email, username, link);
        const status = await sendEmail(email, username, mailOptions, link);
        if (!status) throw new Error("Email not sent");
        return "Enter your email to confirm your account";
    } catch (e) {
        if (e instanceof QueryFailedError) {
            if (e.driverError.code === DUPLICATE_KEY_ERROR_CODE && e.driverError.constraint === 'UQ_user_email')
                throw new Error(`This email is taken`);
        }
        throw new Error("User failed to be created...");
    }
}

export const login = async ({email, password}) => {
    const TTL = parseInt(process.env.TTL);
    email = email.toLowerCase();
    const user: User = await usersRepository.findOneBy({email});
    if (!user) {
        throw new Error("Email / password is incorrect!");
    }
    if (!user.confirmed) {
        throw new Error("Please confirm your email address");
    }
    const isAuthorities: boolean = await bcrypt.compare(password, user.password)
    if (isAuthorities) {
        const token: string = jsonwebtoken.sign({user}, process.env.JWT_SECRET, {
            expiresIn: TTL
        })
        return (token);
    }
    throw new Error("Email / password is incorrect!");
}

export const changeRole = async ({email, reqRole}) => {
    email = email.toLowerCase();
    const user: User = await usersRepository.findOneBy({email});
    if (!user) {
        throw new Error(`There is no user with email: ${email}`);
    }
    user.role = reqRole;
    await usersRepository.update({username: user.username}, user);
    return user;
}

export const requestPasswordLink = async ({email}) => {
    let user: User;
    try {
        user = await usersRepository.findOneBy({email});
    } catch (e) {
        throw new Error("Password reset link not sent");
    }
    if (!user) {
        throw new Error(`There is no user with email: ${email}`);
    }
    const link = generateRequestPasswordLink(process.env.FRONTEND_URL, user.id);
    const mailOptions = generateRequestPasswordBodyMail(email, user.username, link);
    const status = await sendEmail(email, user.username, mailOptions, link);
    if (!status) throw new Error("Email not sent");
    return "Enter the link in your email to reset your password";
}


export const resetUserPassword = async ({userId, password}) => {
    const user = await usersRepository.findOne({where: {id: userId}});
    if (!user) {
        throw new Error("Page not found");
    }
    user.password = await bcrypt.hash(password, 10);
    await usersRepository.update({id: userId}, user);
    return `Password changed successfully`;
}