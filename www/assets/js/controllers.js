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
    tabbarPage: function (page) {
        page.querySelector('[component="button/menu"]').onclick = function () {
            document.querySelector('#mySplitter').left.toggle();
        };

        Array.prototype.forEach.call(page.querySelectorAll('[component="button/new-flat"]'), function (element) {
            element.onclick = function () {
                document.querySelector('#myNavigator').pushPage('html/flat/flat_new.html');
            };
        });

    },

    //Menu page
    menuPage: function (page) {
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/menu-item"]'), function (element) {
            element.onclick = function () {
                document.querySelector('#myNavigator').pushPage('html/' + element.getAttribute('data-url'));
            };
        });
    },

    //User info page
    userPage: function (page) {
        myApp.services.user.fill(page);
    },

    //Flat list page
    flatListPage: function (page) {
        let flats = myApp.user.flats();
        if (Object.keys(flats).length === 0) {
            myApp.services.flat.emptyList(page);
        } else {
            myApp.services.flat.list(page, flats);
        }
    },

    //Single flat page
    flatPage: function (page) {
        if (myApp.user.isLandlord()) {
            if (Object.keys(page.data).length !== 0 || myApp.user.currentFlat() !== undefined) {
                let info = myApp.user.currentFlat() ? myApp.user.currentFlat() : page.data.element;
                let flat = ons.createElement('<div>' + info.name + '</div>');
                page.querySelector('.content').appendChild(flat);
            } else {
                let flats = myApp.user.flats();
                myApp.services.flat.emptyFlatLandlord(page);
                myApp.services.flat.list(page, flats);
            }
        }
    },

    //New flat page
    newFlatPage: function (page) {

    }

};
