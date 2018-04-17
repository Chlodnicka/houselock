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

});

