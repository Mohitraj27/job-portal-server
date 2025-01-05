import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { config } from '@config/env';
import { throwError } from '@utils/throwError';
import httpStatus from '@utils/httpStatus';
import { USER_MESSAGES } from '../modules/user/user.enum';

export const sendEmail = async (to: string, subject: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: config.SMTP_HOST,
        port: config.SMTP_PORT,
        secure: false,
        auth: {
            user: config.GOOGLE_EMAIL,
            pass: config.GOOGLE_PASSWORD,
        },
        logger: true,
        debug: true
    } as SMTPTransport.Options);

    const mailOptions = {
        from: config.GOOGLE_EMAIL,
        to,
        subject,
        html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throwError(httpStatus.INTERNAL_SERVER_ERROR, USER_MESSAGES.ERROR_SENDING_EMAIL);
    }
};
