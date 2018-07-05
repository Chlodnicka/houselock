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

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


exports.addMessage = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    return admin.database().ref('/messages').push({original: original}).then((snapshot) => {
        // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
        return res.redirect(303, snapshot.ref.toString());
    });
});


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


exports.sendWelcomeEmail = functions.database.ref('invitation/{id}/').onWrite(event => {

    // only trigger for new users [event.data.previous.exists()]
    // do not trigger on delete [!event.data.exists()]
    if (!event.data.exists() || event.data.previous.exists()) {
        return
    }

    const invitation = event.data.val();

    const data = {
        from: 'app@app.com',
        subject: 'Welcome!',
        html: `<p>Welcome! </p>`,
        'h:Reply-To': 'houselock@gmail.com',
        to: invitation.email
    };

    mailgun.messages().send(data, function (error, body) {
        console.log(body)
    });
});