/***********************************************************************
 * App Controllers. These controllers will be called on page initialization. *
 ***********************************************************************/

myApp.controllers = {

    //Loader page
    loaderPage: function (page) {
        myApp.services.common.checkCredentials();
    },

    //Login page
    loginPage: function (page) {
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/login"]'), function (element) {
            element.onclick = function () {
                let form = page.querySelector('form');
                let email = $(form).find('#username').children('input').val();
                let password = $(form).find('#password').children('input').val();
                firebase.auth().signInWithEmailAndPassword(email, password)
                    .catch(function(error) {
                        console.log(error);
                        // myApp.services.common.authorizeFail()
                });
            };
        });
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/register-new-owner"]'), function (element) {
            element.onclick = function () {
                document.querySelector('#myNavigator').pushPage('html/auth/register_owner.html');
            };
        });
    },

    registerPage: function (page) {
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/register"]'), function (element) {
            element.onclick = function () {
                let form = page.querySelector('form');
                let email = $(form).find('#username').children('input').val();
                let password = $(form).find('#password').children('input').val();
                firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then(myApp.services.common.authorizeRegister())
                    .catch(function(error) {
                    myApp.services.common.authorizeFail()
                });
            };
        });
    },

    tenantTabbarPage: function (page) {
        myApp.services.user.userAlerts(page);
    },

    landlordTabbarPage: function (page) {
        myApp.services.user.userAlerts(page);
    },

    settingsPage: function (page) {
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/flat-list"]'), function (element) {
            element.onclick = function () {
                document.querySelector('#myNavigator').pushPage('html/flat/flat_list.html');
            };
        });
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/user-info"]'), function (element) {
            element.onclick = function () {
                document.querySelector('#myNavigator').pushPage('html/user/user_info.html');
            };
        });
    },

    alertsPage: function (page) {
        let alerts = myApp.user.alerts();
        myApp.services.user.fillAlerts(page, alerts);
    },

    //Flat list page
    flatListPage: function (page) {
        myApp.services.flat.list(page);
    },

    //Single flat page
    flatPage: function (page) {
        let id = myApp.services.flat.current();
        myApp.services.flat.display(page, id);
    },

    //New flat page
    newFlatPage: function (page) {
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/new-flat"]'), function (element) {
            element.onclick = function () {
                document.querySelector('#addFlat').pushPage('html/flat/flat_new.html');
            };
        });
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/add-flat"]'), function (element) {
            element.onclick = function () {
                myApp.services.flat.create(page);
            };
        });
    },

    billListPage: function (page) {
        let bills = myApp.flat.bills();
        if (Object.keys(bills).length === 0) {
            myApp.services.bill.emptyList(page);
        } else {
            myApp.services.bill.list(page, bills);
        }
    },

    billPage: function (page) {
        //todo: display_bill
        //todo: edit_bill
        myApp.services.bill.fill(page, page.data.element);
    },

    usersPage: function (page) {
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/new-tenant"]'), function (element) {
            element.onclick = function () {
                document.querySelector('#myNavigator').pushPage('html/user/user_new.html');
            };
        });
        let tenants = myApp.flat.tenants();
        if (Object.keys(tenants).length === 0) {
            myApp.services.user.emptyList(page);
        } else {
            myApp.services.user.list(page, tenants);
        }
    },

    //User info page
    userPage: function (page) {

        if (myApp.user.isTenant()) {
            let backButton = page.querySelector('.back-button');
            $(backButton).remove();
        }

        myApp.services.user.fill(page);

        Array.prototype.forEach.call(page.querySelectorAll('[component="button/logout"]'), function (element) {
            element.onclick = function () {
                myApp.services.common.redirectToLogin();
            };
        });
    },

    tenantPage: function (page) {
        let info = page.data.element;
        myApp.services.user.fill(page, info);
        myApp.services.user.remove(page, info);
    },

    tenantNewPage: function (page) {
        form = $(page.querySelector('form'));
        let action = form.attr('data-ajax').replace('{id}', myApp.user.currentFlatId());
        form.attr('data-ajax', action);
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/save"]'), function (element) {
            element.onclick = function () {
                myApp.services.common.save(page, myApp.services.common.updateFlat);
            };
        });
    },

    dashboardPage: function (page) {
        let lastBill = myApp.flat.bill();
        if (Object.keys(lastBill).length === 0) {
            myApp.services.dashboard.noLastBill(page);
        } else {
            myApp.services.bill.fill(page, lastBill);
        }
    },

    userNoFlatPage: function (page) {
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/logout"]'), function (element) {
            element.onclick = function () {
                myApp.services.common.redirectToLogin();
            };
        });
    },

    userAcceptPage: function (page) {
        let flatInfo = myApp.flat.currentFlat();
        let flat_number = flatInfo.flat_number ? '/' + flatInfo.flat_number : '';
        let flat = ons.createElement(
            '<div>' +
            '<ons-list-item>Ulica i numer: ' + flatInfo.street + ' ' + flatInfo.building_number + flat_number + '</ons-list-item>' +
            '<ons-list-item>Miasto: ' + flatInfo.city + '</ons-list-item>' +
            '</div>'
        );

        page.querySelector('.flat_info').appendChild(flat);

        Array.prototype.forEach.call(page.querySelectorAll('[component="button/accept"]'), function (element) {
            element.onclick = function () {
                myApp.services.user.accept();
            };
        });

        Array.prototype.forEach.call(page.querySelectorAll('[component="button/ignore"]'), function (element) {
            element.onclick = function () {
                myApp.services.user.ignore();
            };
        });

    },

    userAcceptRemovalPage: function (page) {
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/accept-removal"]'), function (element) {
            element.onclick = function () {
                myApp.services.user.acceptRemoval();
            };
        });
    }
};