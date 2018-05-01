/***********************************************************************
 * App Controllers. These controllers will be called on page initialization. *
 ***********************************************************************/

myApp.controllers = {

    //Loader page
    loaderPage: function (page) {
        if (myApp.services.common.token.get()) {
            myApp.services.common.token.check();
        } else {
            if (myApp.services.common.checkCredentials()) {
                myApp.services.common.authorize();
            } else {
                myApp.services.common.redirectToLogin();
            }
        }
    },

    //Login page
    loginPage: function (page) {
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/login"]'), function (element) {
            element.onclick = function () {
                ajax.sendForm(page, myApp.services.common.authorizeSuccess, myApp.services.common.authorizeFail);
            };
        });
    },

    //Tabbar page
    landlordTabbarPage: function (page) {
        page.querySelector('[component="button/menu"]').onclick = function () {
            document.querySelector('#landlordSplitter').left.toggle();
        };
    },

    //Menu page
    menuPage: function (page) {
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/menu-item"]'), function (element) {
            element.onclick = function () {
                document.querySelector('#myNavigator').pushPage('html/' + element.getAttribute('data-url'));
            };
        });
    },

    //Flat list page
    flatListPage: function (page) {
        let flats = myApp.user.flats();
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/new-flat"]'), function (element) {
            element.onclick = function () {
                document.querySelector('#myNavigator').pushPage('html/flat/flat_new.html');
            };
        });
        if (Object.keys(flats).length === 0) {
            myApp.services.flat.emptyList(page);
        } else {
            myApp.services.flat.list(page, flats);
        }
    },

    //Single flat page
    flatPage: function (page) {
        if (myApp.user.isLandlord()) {
            if ((page.data && Object.keys(page.data).length !== 0) || myApp.user.currentFlat() !== undefined) {
                let info = myApp.user.currentFlat() ? myApp.user.currentFlat() : page.data.element;
                let flat = ons.createElement('<div>' + info.name + '</div>');
                page.querySelector('.content').appendChild(flat);
            } else {
                let flats = myApp.user.flats();
                myApp.services.flat.emptyFlatLandlord(page);
                myApp.services.flat.list(page, flats);
            }
        } else if (myApp.user.currentFlat() !== undefined) {
            let info = myApp.user.currentFlat();
            let flat = ons.createElement('<div>' + info.name + '</div>');
            page.querySelector('.content').appendChild(flat);
        }
    },

    //New flat page
    newFlatPage: function (page) {

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
        myApp.services.user.fill(page);
    },

    tenantPage: function (page) {
        let info = page.data.element;
        myApp.services.user.fill(page, info);
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/remove-tenant"]'), function (element) {
            element.onclick = function () {
                document.getElementById('removeTenant').show();
            };
        });
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/delete-tenant"]'), function (element) {
            element.onclick = function () {
                console.log('remove');
                document.getElementById('removeTenant').hide();
            };
        });
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/cancel"]'), function (element) {
            element.onclick = function () {
                document.getElementById('removeTenant').hide();
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
    }
};
