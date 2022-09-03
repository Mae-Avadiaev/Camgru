const nodemailer = require('nodemailer')
const htmlToText = require('html-to-text');
ejs = require('ejs')


module.exports = class Email {
    constructor(user, url, rawUrl) {
        this.to = user.email
        this.firstName = user.firstName
        this.url = url
        this.rawUrl = rawUrl
        this.from = `Camgru 42 <${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            // Sendgrid
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                }
            })
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }
    // Send the actual email
    async send(template, subject) {
        // 1) Render HTML based on an ejs template
        const html = await ejs.renderFile(`${__dirname}/../views/email/${template}.ejs`, {
            firstName: this.firstName,
            url: this.url,
            rawUrl: this.rawUrl,
            subject
        })

        // 2) Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html)
        };

        // 3) Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendEmailConfirmation() {
        await this.send('confirmEmail', 'Confirm your email');
    }

    async sendPasswordReset() {
        await this.send(
            'passwordReset',
            'Password reset (valid for 10 minutes)'
        );
    }

    async sendLikeNotification(submitter) {
        await this.send('likeNotification', `${submitter} liked your post!`)
    }

    async sendCommentNotification(submitter) {
        await this.send('commentNotification', `${submitter} commented on your post!`)
    }

}


