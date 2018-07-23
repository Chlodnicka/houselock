const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const nodemailer = require('nodemailer');

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailEmail,
        pass: gmailPassword,
    },
});

const APP_NAME = 'Houselock';


exports.sendInvitation = functions.database.ref('/invitations/{id}')
    .onCreate((snapshot, context) => {
        const invitation = snapshot.val();

        const mailOptions = {
            from: `${APP_NAME} <noreply@firebase.com>`,
            to: invitation.email,
        };

        mailOptions.subject = `Witamy w ${APP_NAME}!`;
        mailOptions.text = `Dzień dobry! Właściciel mieszkania zaprasza cię do używania aplikacji ${APP_NAME}. Zarejestruj się i zrób porządek z płatnościami za mieszkanie. Jeśli nie wiesz dlaczego otrzymałeś tego maila, zignoruj go.`;
        return mailTransport.sendMail(mailOptions).then(() => {
            return console.log('Wysłano email z zaproszeniem na adres:', invitation.email);
        });
    });
