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
        return true;
    },

    validateFlat: function(flatData) {
        var mercenaryPattern = /\d{1,9}/;
        var buildingNumberPattern = /\d{1,4}/
        var cityPattern = /^[a-zA-Z\u0080-\u024F]+(?:([\ \-\']|(\.\ ))[a-zA-Z\u0080-\u024F]+)*$/;
        var flatNumberPattern = /\d{0,3}/;
        var payDayPattern = /^[1-9]|[1,2][0-9]$/;
        var amountPattern = /^\d*\.?\d{2}$/;
        if (flatData.street.length == 0) {
            ons.notification.alert({ message: 'Nazwa mieszkania nie może być pusta!' });
            return false;
        }
        if (!mercenaryPattern.test(flatData.mercenary)) {
            ons.notification.alert({ message: 'Kwota za wynajem jest niepoprawna!' });
            return false;
        }
        if (!buildingNumberPattern.test(flatData.building_number)) {
            ons.notification.alert({ message: 'Numer budynku jest niepoprawny!' });
            return false;
        }
        if (!cityPattern.test(flatData.city)) {
            ons.notification.alert({ message: 'Nazwa miasta jest niepoprawna!' });
            return false;
        }
        if (!flatNumberPattern.test(flatData.flat_number)) {
            ons.notification.alert({ message: 'Numer mieszkania jest niepoprawny!' });
            return false;
        }
        if (!payDayPattern.test(flatData.pay_day)) {
            ons.notification.alert({ message: 'Dzien płatności jest niepoprawny!' });
            return false;
        }
        console.log(flatData.meters.gas);
        /**if (!amountPattern.test(flatData.ga)) {
            ons.notification.alert({ message: 'Dzien płatności jest niepoprawny!' });
            return false;
        }*/
        return true;
    },

    validateUserData: function(userData) {
        var namePattern = /^(?!\s*$).+/;
        var lastnamePattern = /^(?!\s*$).+/;
        var phonePattern = /^[0-9]{6,14}/
        var accountPattern = /^\d{1,30}$/;
        if (!namePattern.test(userData.firstname)) {
            ons.notification.alert({ message: 'Imię jest niepoprawne!' });
            return false;
        }
        if (!lastnamePattern.test(userData.lastname)) {
            ons.notification.alert({ message: 'Nazwisko jest niepoprawne!' });
            return false;
        }
        if (!phonePattern.test(userData.phone)) {
            ons.notification.alert({ message: 'Numer telefonu jest niepoprawny!' });
            return false;
        }
        if (!accountPattern.test(userData.account_number)) {
            ons.notification.alert({ message: 'Numer konta bankowego jest niepoprawny!' });
            return false;
        }
        return true;

    }

}