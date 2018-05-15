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

});

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

    navigator.notification.alert(
        'You are the winner!',  // message
        alertDismissed,         // callback
        'Game Over',            // title
        'Done'                  // buttonName
    );

    function alertDismissed() {
        // do something
    }
}
