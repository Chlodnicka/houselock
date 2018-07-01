// App logic.
window.myApp = {};


ons.ready(function () {

});


document.addEventListener('init', function (event) {
    let page = event.target;

    // Each page calls its own initialization controller.
    if (myApp.controllers.hasOwnProperty(page.id)) {
        myApp.controllers[page.id](page);
    }


    firebase.auth().onAuthStateChanged(function(user) {
        //todo: znaleźć lepszy moment na update rachunku
        if (user) {
            myApp.bill.last().once('value', function (flatBills) {
                let billId = Object.keys(flatBills.val());
                let bill = flatBills.val()[billId];
                let now = new Date();
                let date = now.getFullYear() + '_' + now.getMonth();
                if(bill.date < date || flatBills.numChildren() === 0) {
                     myApp.services.bill.create();
                 }
            });
        }
    });

});

