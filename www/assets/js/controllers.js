/***********************************************************************
 * App Controllers. These controllers will be called on page initialization. *
 ***********************************************************************/

myApp.controllers = {

    //Loader page
    loaderPage: function (page) {
        if (myApp.user.check()) {
            myNavigator.pushPage('splitter.html');
        } else {
            myNavigator.pushPage('html/auth/login.html');
        }
    },

    //Login page
    loginPage: function (page) {
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/login"]'), function (element) {
            element.onclick = function () {
                ajax.sendForm(page, myApp.services.user.authorizeSuccess, myApp.services.user.authorizeFail);
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
        myApp.services.flat.list(page);
    },

    //Single flat page
    flatPage: function (page) {
        if (page.data === undefined && !myApp.user.currentFlat()) {
            //do sth if there is no flat chosen
        } else {
            let info = myApp.user.currentFlat() ? myApp.user.currentFlat() : page.data.element;
            let flat = ons.createElement('<div>' + info.name + '</div>');
            page.querySelector('.content').appendChild(flat);
        }
    },

    //New flat page
    newFlatPage: function (page) {

    }

};
