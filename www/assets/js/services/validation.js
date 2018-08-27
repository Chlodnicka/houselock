myApp.services.validation = {

    validateEmail: function(input) {
        var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(input);
    },

    validateName: function(input) {
        var pattern = /^[a-z ,.'-]+$/i
        return pattern.test(input)
    },

    validateUserRegistration: function(email, firstname, lastname) {
        if (!this.validateEmail(email)) {
            ons.notification.alert({ message: 'Niepoprawny adres email, spróbuj ponownie!' });
            return false;
        }
        if (!this.validateName(firstname)) {
            ons.notification.alert({ message: 'Niepoprawne imię, spróbuj ponownie!' });
            return false;
        }
        if (!this.validateName(lastname)) {
            ons.notification.alert({ message: 'Niepoprawne nazwisko, spróbuj ponownie!' });
            return false;
        }
    },

}