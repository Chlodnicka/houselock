/***********************************************************************
 * App Controllers. These controllers will be called on page initialization. *
 ***********************************************************************/

myApp.controllers = {

    setRolePage: function (page) {
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/landlord"]'), function (element) {
            element.onclick = function () {
                myApp.user.setRole('LANDLORD');
            };
        });
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/tenant"]'), function (element) {
            element.onclick = function () {
                myApp.user.setRole('TENANT');
            };
        });
    },

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
                firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
                    myApp.services.common.checkCredentials();
                }).catch(function (error) {
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
                let email = $(page.querySelector('form')).find('#email').children('input').val();
                let password = $(page.querySelector('form')).find('#password').children('input').val();
                let data = form.serialize(page);
                delete data.password;
                firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then(function (user) {
                        myApp.services.user.create(data);
                    })
                    .catch(function (error) {
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
        myApp.services.bill.list(page);
    },

    billPage: function (page) {
        myApp.services.bill.fill(page, page.data.element);
    },

    usersPage: function (page) {
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/new-tenant"]'), function (element) {
            element.onclick = function () {
                document.querySelector('#myNavigator').pushPage('html/user/user_new.html');
            };
        });
        myApp.services.user.list(page);
    },

    //User info page
    userPage: function (page) {
        myApp.user.role().once('value').then(function (role) {
            if (myApp.user.isTenant(role.val())) {
                let backButton = page.querySelector('.back-button');
                $(backButton).remove();
            }
            myApp.services.user.display(page);

            Array.prototype.forEach.call(page.querySelectorAll('[component="button/logout"]'), function (element) {
                element.onclick = function () {
                    myApp.services.common.redirectToLogin();
                };
            });
        });
    },

    tenantPage: function (page) {
        let info = page.data.element;
        myApp.services.user.fill(page, info);
        myApp.services.user.remove(page, info);
    },

    tenantNewPage: function (page) {
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/save"]'), function (element) {
            element.onclick = function () {
                myApp.services.user.addTenant(page);
            };
        });
    },

    dashboardPage: function (page) {
        myApp.services.dashboard.lastBill(page);
    },

    userNoFlatPage: function (page) {
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/logout"]'), function (element) {
            element.onclick = function () {
                myApp.services.common.redirectToLogin();
            };
        });
    },

    userAcceptPage: function (page) {
        myApp.flat.current().once('value').then(function (flatSnapshot) {
            let flatData = flatSnapshot.val();
            let flat_number = flatData.flat_number ? '/' + flatData.flat_number : '';
            let flat = ons.createElement(
                '<div>' +
                '<ons-list-item>Ulica i numer: ' + flatData.street + ' ' + flatData.building_number + flat_number + '</ons-list-item>' +
                '<ons-list-item>Miasto: ' + flatData.city + '</ons-list-item>' +
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