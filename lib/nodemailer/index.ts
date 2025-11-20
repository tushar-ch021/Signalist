import nodemailer from 'nodemailer'
import { NEWS_SUMMARY_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "./templetes"
export const transporter =nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMNODE_MAILER,
      pass: process.env.NODE_MAILER_PASSWORD
    }
})
export const sendWelcomeEmail=async ({email,name,intro}:WelcomeEmailData) =>{
    const htmlTemplete=WELCOME_EMAIL_TEMPLATE.replace('{{name}}',name).replace('{{intro}}',intro)
    const mailOptions={
        from:`"Signalist" <V7Bt2@example.com>`,
        to:email,
        subject:'Welcome to Signalist!',
        html:htmlTemplete
    }
    await transporter.sendMail(mailOptions)
}
export const sendNewsSummaryEmail = async (
    { email, date, newsContent }: { email: string; date: string; newsContent: string }
): Promise<void> => {
    const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
        .replace('{{date}}', date)
        .replace('{{newsContent}}', newsContent);

    const mailOptions = {
        from: `"Signalist News" <signalist@tusharchaudhary02100>`,
        to: email,
        subject: `📈 Market News Summary Today - ${date}`,
        text: `Today's market news summary from Signalist`,
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
};