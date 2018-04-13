function init() {
	document.addEventListener("deviceready",onDeviceReady, false);
}

function onDeviceReady() {
	navigator.notification.beep(2);
	deviceInfo();
}

ons.ready(function() {
    // Cordova APIs are ready
    console.log(ons);
});