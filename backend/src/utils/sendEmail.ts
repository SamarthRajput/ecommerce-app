import { randomUUID } from "crypto";
import nodemailer from "nodemailer"; ``

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

export const sendEmail = async ({ from, to, subject, text, html }: { from: string, to: string, subject: string, text?: string, html: string }) => {
    const info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
        messageId: `<${randomUUID()}@interlinkb.com>`
    });
    return info;
};