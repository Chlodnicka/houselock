// App logic.
window.myApp = {};


ons.ready(function () {

});


document.addEventListener('init', function (event) {
    var page = event.target;

    // Each page calls its own initialization controller.
    if (myApp.controllers.hasOwnProperty(page.id)) {
        myApp.controllers[page.id](page);
    }


    document.addEventListener('deviceready', function () {
        // Enable to debug issues.
         window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

        var notificationOpenedCallback = function (jsonData) {
            console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
        };

        window.plugins.OneSignal
            .startInit("da20d043-c374-4553-8fe4-32a95c7c7742")
            .handleNotificationOpened(notificationOpenedCallback)
            .endInit();
    }, false);
})
;

