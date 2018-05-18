myApp.services.common = {

    parseStatus: function (status) {
        switch (status) {
            case 'TEMP':
                return 'Zaproszenie oczekuje na akceptację lokatora';
                break;
            case 'DELETED_BY_LANDLORD':
                return 'Usunięty - oczekuje na akceptację lokatora';
                break;
            case 'DELETED_BY_SELF' :
                return 'Usunięty - oczekuje na akceptację właściciela';
                break;
            default:
                return 'Aktywny';
        }
    },

    parseAlertMessage: function (message) {
        switch (message) {
            case 'bill_generated':
                return 'Wygenerowano nowy rachunek. Uzupełnij informacje o płatnościach';
                break;
            case 'bill_may_be_paid':
                return 'Rachunek może być opłacony';
                break;
            case 'bill_payment_reminder':
                return 'Właściciel przypomina o płatności.';
                break;
            case 'bill_paid':
                return 'Rachunek został opłacony';
                break;
            default:
                return 'Błąd';
        }
    },


    parseMonth: function(month) {
        switch (month) {
            case 'January':
                return 'styczeń';
                break;
            case 'February':
                return 'luty';
                break;
            case 'March':
                return 'marzec';
                break;
            case 'April':
                return 'kwiecień';
                break;
            case 'May':
                return 'maj';
                break;
            case 'June':
                return 'czerwiec';
                break;
            case 'July':
                return 'lipiec';
                break;
            case 'August':
                return 'sierpień';
                break;
            case 'September':
                return 'wrzesień';
                break;
            case 'October':
                return 'październik';
                break;
            case 'November':
                return 'listopad';
                break;
            case 'December':
                return 'grudzień';
                break;
            default:
                return 'Błąd'
        }
    },

    parsePaymentStatus: function(status) {
        switch (status) {
            case 'NEW':
                return 'nowy';
                break;
            case 'PAID':
                return 'opłacony';
                break;
            case 'PARTIALLY PAID':
                return 'częściowo opłacony';
                break;
            case 'UNPAID':
                return 'nieopłacony';
                break;
            default:
                return 'Błąd'
        }
    },

    parseConfig: function(config) {
        if (config === 'METER') {
            return 'Uzupełnij stan licznika';
        } else if (config === 'BILL') {
            return 'Uzupełnij kwotę rachunku'
        }
        return false;
    },

    parseAction: function(form, id) {
        let ajax = $(form).attr('data-ajax').replace('{id}', id);
        $(form).attr('data-ajax', ajax);
    },

    token: {
        get: function() {
            return localStorage.getItem('token');
        },

        set: function(token) {
            localStorage.setItem('token', token);
        },

        check: function() {
            ajax.send('get', '/api/check', '{}', myApp.services.user.getInfo, myApp.services.common.authorize);
        }
    },

    checkCredentials: function() {
        return myApp.user.email() && myApp.user.password();
    },

    authorize: function() {
        let data = '_username=' + myApp.user.email() + '&_password=' + myApp.user.password();
        ajax.send('post', '/api/login_check', data, myApp.services.common.setTokenAndGetInfo, myApp.services.common.redirectToLogin);
    },

    authorizeSuccess: function(response, page) {
        let form = page.querySelector('form');
        myApp.user.set(form.querySelector('#username').value, form.querySelector('#password').value);
        myApp.services.common.setTokenAndGetInfo(response);
    },

    authorizeFail: function(response) {
        console.log(response.responseJSON.message);
        // ons.notification.alert({message: 'Nie udało się zalogować, spróbuj ponownie!'});
        ons.notification.alert({ message: response.responseJSON.message });
    },

    redirectToLogin: function() {
        myNavigator.pushPage('html/auth/login.html');
        sessionStorage.setItem('isLoggedIn', false);
        myApp.services.common.clearAll();
    },

    setTokenAndGetInfo: function(response) {
        myApp.services.common.token.set(response.token);
        ajax.send('get', '/api/check', '{}', myApp.services.user.getInfo, myApp.services.common.redirectToLogin);
    },

    edit: function(page) {
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/edit"]'), function(element) {
            element.onclick = function() {
                element.style.display = 'none';
                page.querySelector('[component="button/save"]').style.display = 'block';
                page.querySelector('[component="button/cancel"]').style.display = 'block';
                Array.prototype.forEach.call(page.querySelectorAll('form ons-list-item'), function(listitem) {
                    listitem.style.display = 'none';
                });
                Array.prototype.forEach.call(page.querySelectorAll('form .edit'), function(edititem) {
                    edititem.style.display = 'block';
                });
            };
        });
    },

    cancel: function(page) {
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/cancel"]'), function(element) {
            element.onclick = function() {
                element.style.display = 'none';
                page.querySelector('[component="button/save"]').style.display = 'none';
                page.querySelector('[component="button/edit"]').style.display = 'block';
                Array.prototype.forEach.call(page.querySelectorAll('form ons-list-item'), function(listitem) {
                    listitem.style.display = 'flex';
                });
                Array.prototype.forEach.call(page.querySelectorAll('form .edit'), function(edititem) {
                    edititem.style.display = 'none';
                });
            };
        });
    },

    save: function(page, onSuccess) {
        ajax.sendForm(page, onSuccess);
    },

    clearAll: function() {
        localStorage.clear();
        sessionStorage.clear();
    },

    setCurrentFlat: function(id) {
        localStorage.setItem('currentFlat', id);
        ajax.send('get', '/api/flat/' + id, '{}', myApp.services.common.updateFlat);
    },

    updateFlat: function(response) {
        let data = JSON.stringify(response);
        localStorage.setItem('flatData', data);
        myNavigator.pushPage(myApp.user.splitter());
    },

    updateFlatInvitation: function(response) {
        let data = JSON.stringify(response);
        localStorage.setItem('flatData', data);
        myNavigator.pushPage('html/user/user_accept_invitation.html');
    },

    updateUser: function(response) {
        let data = JSON.stringify(response);
        localStorage.setItem('userData', data);
        myNavigator.pushPage(myApp.user.splitter());
    },

    updateInfoAfter: function(response) {
        let data = JSON.stringify(response);
        localStorage.setItem('userData', data);
        localStorage.removeItem('currentFlat');
        localStorage.removeItem('flatData');
        myNavigator.pushPage('html/flat/flat_list.html');
    }
};