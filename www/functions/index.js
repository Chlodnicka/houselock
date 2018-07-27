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


exports.hourly_job =
    functions.pubsub.topic('hourly-tick').onPublish((event) => {
        return admin.database().ref('/flats').once('value', function (flatsSnapshot) {
            let flats = flatsSnapshot.val();
            Object.keys(flats).forEach(function(key){
                let flatId = key;
                let flat = flats[key];
                return admin.database().ref('/flats/' + flatId + '/bills').orderByChild('date').once('value', function (billsSnapshot) {
                    let billId = billsSnapshot.val() ? Object.keys(billsSnapshot.val())[0] : null;
                    let bill = billsSnapshot.val() ? billsSnapshot.val()[billId] : null;
                    let now = new Date();
                    let date = now.getFullYear() + '_' + now.getMonth();
                    let billDate = bill ? bill.date : '';
                    if (((bill && billDate < date) || billsSnapshot.numChildren() === 0) && flat.tenants) {
                        let now = new Date();
                        let sum = 0;
                        let details = {};
                        let meters = {};
                        if (flat.config) {
                            Object.keys(flat.config).forEach(function(key){
                                let value = flat.config[key];
                                if (value.type === 'static') {
                                    sum += details[key] = parseFloat(value.value);
                                } else if (value.type === 'metric') {
                                    let billValue = '0.00';
                                    sum += details[key] = (parseFloat(billValue) - flat.meters[key]) * parseFloat(value.value);
                                    meters[key] = parseFloat(billValue);
                                } else if (value.type === 'bill') {
                                    sum += details[key] = parseFloat('0.00');
                                }
                            });
                        }
                        sum += parseFloat(flat.mercenary);
                        let bill = {
                            sum: sum,
                            details: details,
                            date: now.getFullYear() + '_' + now.getMonth(),
                            status: 'NEW',
                            meters: meters
                        };
                        let updates = {};
                        let billKey = admin.database().ref().child('bills').push().key;
                        updates['/bills/' + billKey] = bill;
                        updates['/flats/' + flatId + '/bills/' + billKey] = {date: now.getFullYear() + '_' + now.getMonth()};
                        return admin.database().ref().update(updates, function (error) {
                            if (error) {
                                console.log(error)
                            }
                        });
                    }
                });
            });
        });
    });