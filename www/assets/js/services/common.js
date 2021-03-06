myApp.services.common = {

    parseStatus: function(status) {
        switch (status) {
            case 'NEW':
                return 'Zaproszony';
                break;
            case 'WAITING':
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

    parseAddress: function(flat) {
        let address = flat.city.trim() + ', ' + flat.street + ' ' + flat.building_number;
        if (flat.flat_number) {
            address += '/' + flat.flat_number;
        }
        return address;
    },

    parseMonth: function(month) {
        switch (month) {
            case '0':
                return 'styczeń';
                break;
            case '1':
                return 'luty';
                break;
            case '2':
                return 'marzec';
                break;
            case '3':
                return 'kwiecień';
                break;
            case '4':
                return 'maj';
                break;
            case '5':
                return 'czerwiec';
                break;
            case '6':
                return 'lipiec';
                break;
            case '7':
                return 'sierpień';
                break;
            case '8':
                return 'wrzesień';
                break;
            case '9':
                return 'październik';
                break;
            case '10':
                return 'listopad';
                break;
            case '11':
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
            case 'PARTIALLY_PAID':
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
        if (config === 'metric') {
            return 'Uzupełnij stan licznika';
        } else if (config === 'bill') {
            return 'Uzupełnij kwotę rachunku'
        }
        return false;
    },

    checkCredentials: function() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                myApp.services.common.authorizeSuccess()
            } else {
                myApp.services.common.redirectToLogin()
            }
        });
    },

    authorizeSuccess: function() {

        myApp.user.role().once('value').then(function(snapshot) {
            let role = snapshot.val();
            if (myApp.user.isLandlord(role)) {
                myApp.user.flats().once('value').then(function(snapshot) {
                    let flats = snapshot.val();
                    if (flats) {
                        if (Object.keys(flats).length > 1) {
                            if (myApp.flat.id()) {
                                myNavigator.pushPage('landlordSplitter.html');
                            } else {
                                myNavigator.pushPage('html/flat/flat_list.html');
                            }
                        } else {
                            myApp.services.flat.setCurrent(Object.keys(flats)[0]);
                            myNavigator.pushPage('landlordSplitter.html');
                        }
                    } else {
                        myNavigator.pushPage('html/flat/flat_list.html');
                    }
                });
            } else if (myApp.user.isTenant(role)) {
                myApp.user.current().once('value').then(function(userSnapshot) {
                    let user = userSnapshot.val();
                    console.log(user.status);
                    if (user.flat) {
                        myApp.services.flat.setCurrent(user.flat);
                        if (user.status === 'DELETED_BY_LANDLORD') {
                            myNavigator.pushPage('html/user/user_deleted.html');
                        } else if (user.status === 'WAITING') {
                            myNavigator.pushPage('html/user/user_accept_invitation.html');
                        } else if (user.status === 'DELETED_BY_SELF') {
                            myNavigator.pushPage('html/user/user_no_flat.html');
                        } else {
                            myApp.services.flat.setCurrent(user.flat);
                            myNavigator.pushPage('tenantSplitter.html');
                        }
                    } else {
                        myNavigator.pushPage('html/user/user_no_flat.html');
                    }
                });
            } else {
                myNavigator.pushPage('html/user/set_role.html');
            }
        });
    },

    authorizeFail: function(response) {
        // ons.notification.alert({message: 'Nie udało się zalogować, spróbuj ponownie!'});
        ons.notification.alert({ message: response.responseJSON.message });
    },

    redirectToLogin: function() {
        firebase.auth().signOut().then(function() {
            myApp.services.common.clearAll();
            myNavigator.pushPage('html/auth/login.html');
        }).catch(function(error) {
            // An error happened.
        });

    },

    selectOption: function(config) {
        if (config) {
            if (config.type === 'bill') {
                return '<option value="bill" selected>Na bazie rachunku</option>' +
                    '<option value="metric">Kwota za jednostkę</option>' +
                    '<option value="static">Stała opłata</option>';
            } else if (config.type === 'metric') {
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

    getTextFromOption: function(config) {
        if (config) {
            if (config.type === 'bill') {
                return 'Na bazie rachunku';
            } else if (config.type === 'metric') {
                return 'Kwota za jednostkę';
            } else {
                return 'Stała opłata';
            }
        }
        return 'Brak'
    },

    edit: function(page) {
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/edit"]'), function(element) {
            element.onclick = function() {
                element.style.display = 'none';
                page.querySelector('[component="button/save"]').style.display = 'block';
                page.querySelector('[component="button/cancel"]').style.display = 'block';
                if (page.querySelector('div.flat_config_info')) {
                    page.querySelector('div.flat_config_info').style.display = 'none';
                }
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
                if (page.querySelector('[component="button/edit"]')) {
                    page.querySelector('[component="button/edit"]').style.display = 'block';
                }
                if (page.querySelector('[component="button/flat-edit"]')) {
                    page.querySelector('[component="button/flat-edit"]').style.display = 'block';
                }

                if (page.querySelector('div.config_info')) {
                    page.querySelector('div.config_info').style.display = 'block';
                }

                Array.prototype.forEach.call(page.querySelectorAll('form ons-list-item'), function(listitem) {
                    listitem.style.display = 'flex';
                });
                Array.prototype.forEach.call(page.querySelectorAll('form .edit'), function(edititem) {
                    edititem.style.display = 'none';
                });
            };
        });
    },

    clearAll: function() {
        localStorage.clear();
        sessionStorage.clear();
    },
};