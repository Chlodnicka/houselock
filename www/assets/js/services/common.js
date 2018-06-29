myApp.services.common = {

    parseStatus: function (status) {
        switch (status) {
            case 'TEMP':
                return 'Zaproszenie oczekuje na akceptację lokatora';
                break;
            case 'DELETED_BY_LANDLORD':
                return 'Usunięty - oczekuje na akceptację lokatora';
                break;
            case 'DELETED_BY_SELF':
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


    parseMonth: function (month) {
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

    parsePaymentStatus: function (status) {
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

    parseConfig: function (config) {
        if (config === 'metric') {
            return 'Uzupełnij stan licznika';
        } else if (config === 'bill') {
            return 'Uzupełnij kwotę rachunku'
        }
        return false;
    },

    parseAction: function (form, id) {
        let ajax = $(form).attr('data-ajax').replace('{id}', id);
        $(form).attr('data-ajax', ajax);
    },

    token: {
        get: function () {
            return localStorage.getItem('token');
        },

        set: function (token) {
            localStorage.setItem('token', token);
        },

        check: function () {
            ajax.send('get', '/api/check', '{}', myApp.services.user.getInfo, myApp.services.common.authorize);
        }
    },

    checkCredentials: function () {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                myApp.services.common.authorizeSuccess()
            } else {
                myApp.services.common.redirectToLogin()
            }
        });
    },

    authorizeSuccess: function () {

        myApp.user.role().once('value').then(function (snapshot) {
            let role = snapshot.val();
            if (myApp.user.isLandlord(role)) {
                myApp.user.flats().once('value').then(function (snapshot) {
                    let flats = snapshot.val();
                    if (flats) {
                        if (Object.keys(flats).length > 1) {
                            myNavigator.pushPage('html/flat/flat_list.html');
                        } else {
                            myApp.services.flat.setCurrent(Object.keys(flats)[0]);
                            myNavigator.pushPage('landlordSplitter.html');
                        }
                    } else {
                        myNavigator.pushPage('html/flat/flat_new.html');
                    }
                });
            }
        });
    },

    authorizeRegister: function () {
        myNavigator.pushPage('html/auth/login.html');
    },

    authorizeFail: function (response) {
        // ons.notification.alert({message: 'Nie udało się zalogować, spróbuj ponownie!'});
        ons.notification.alert({message: response.responseJSON.message});
    },

    redirectToLogin: function () {
        firebase.auth().signOut().then(function () {
            myApp.services.common.clearAll();
            myNavigator.pushPage('html/auth/login.html');
        }).catch(function (error) {
            // An error happened.
        });

    },

    selectOption: function (config) {
        if (config) {
            if (config.config_type === 'bill') {
                return '<option value="bill" selected>Na bazie rachunku</option>' +
                    '<option value="metric">Kwota za jednostkę</option>' +
                    '<option value="static">Stała opłata</option>';
            } else if (config.config_type === 'metric') {
                return '<option value="bill">Na bazie rachunku</option>' +
                    '<option value="metric" selected>Kwota za jednostkę</option>' +
                    '<option value="static">Stała opłata</option>';
            } else {
                return '<option value="bill">Na bazie rachunku</option>' +
                    '<option value="metric">Kwota za jednostkę</option>' +
                    '<option value="static" selected>Stała opłata</option>';
            }
        }
        return '<option value="bill">Na bazie rachunku</option>' +
            '<option value="metric">Kwota za jednostkę</option>' +
            '<option value="static">Stała opłata</option>';
    },

    getTextFromOption: function (config) {
        if (config) {
            if (config.config_type === 'bill') {
                return 'Na bazie rachunku';
            } else if (config.config_type === 'metric') {
                return 'Kwota za jednostkę';
            } else {
                return 'Stała opłata';
            }
        }
        return 'Nie zdefiniowano!'
    },

    edit: function (page) {
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/edit"]'), function (element) {
            element.onclick = function () {
                element.style.display = 'none';
                page.querySelector('[component="button/save"]').style.display = 'block';
                page.querySelector('[component="button/cancel"]').style.display = 'block';
                if (page.querySelector('div.flat_config_info')) {
                    page.querySelector('div.flat_config_info').style.display = 'none';
                }
                Array.prototype.forEach.call(page.querySelectorAll('form ons-list-item'), function (listitem) {
                    listitem.style.display = 'none';
                });
                Array.prototype.forEach.call(page.querySelectorAll('form .edit'), function (edititem) {
                    edititem.style.display = 'block';
                });
            };
        });
    },

    cancel: function (page) {
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/cancel"]'), function (element) {
            element.onclick = function () {
                element.style.display = 'none';
                page.querySelector('[component="button/save"]').style.display = 'none';
                if (page.querySelector('[component="button/edit"]')) {
                    page.querySelector('[component="button/edit"]').style.display = 'block';
                }
                if (page.querySelector('[component="button/flat-edit"]')) {
                    page.querySelector('[component="button/flat-edit"]').style.display = 'block';
                }

                if (page.querySelector('div.flat_config_info')) {
                    page.querySelector('div.flat_config_info').style.display = 'block';
                }

                Array.prototype.forEach.call(page.querySelectorAll('form ons-list-item'), function (listitem) {
                    listitem.style.display = 'flex';
                });
                Array.prototype.forEach.call(page.querySelectorAll('form .edit'), function (edititem) {
                    edititem.style.display = 'none';
                });
            };
        });
    },

    save: function (page, onSuccess) {
        ajax.sendForm(page, onSuccess);
    },

    clearAll: function () {
        localStorage.clear();
        sessionStorage.clear();
    },

    updateFlat: function (response) {
        let data = JSON.stringify(response);
        localStorage.setItem('flatData', data);
        myNavigator.pushPage(myApp.user.splitter());
    },

    updateFlatInvitation: function (response) {
        let data = JSON.stringify(response);
        localStorage.setItem('flatData', data);
        myNavigator.pushPage('html/user/user_accept_invitation.html');
    },

    updateInfoAfter: function (response) {
        let data = JSON.stringify(response);
        localStorage.setItem('userData', data);
        localStorage.removeItem('currentFlat');
        localStorage.removeItem('flatData');
        myNavigator.pushPage('html/flat/flat_list.html');
    }
};