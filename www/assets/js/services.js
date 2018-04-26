/***********************************************************************************
 * App Services. This contains the logic of the application organised in modules/objects. *
 ***********************************************************************************/

myApp.services = {

    common: {

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
            return myApp.user.email() && myApp.user.password();
        },

        authorize: function () {
            let data = '_username=' + myApp.user.email() + '&_password=' + myApp.user.password();
            ajax.send('post', '/api/login_check', data, myApp.services.common.setTokenAndGetInfo, myApp.services.common.redirectToLogin);
        },

        authorizeSuccess: function (response, page) {
            let form = page.querySelector('form');
            myApp.user.set(form.querySelector('#username').value, form.querySelector('#password').value);
            myApp.services.common.setTokenAndGetInfo(response);
        },

        authorizeFail: function () {
            console.log('porażka!');
        },

        redirectToLogin: function () {
            myNavigator.pushPage('html/auth/login.html');
            sessionStorage.setItem('isLoggedIn', false);
            myApp.services.common.clearAll();
        },

        setTokenAndGetInfo: function (response) {
            myApp.services.common.token.set(response.token);
            ajax.send('get', '/api/check', '{}', myApp.services.user.getInfo, myApp.services.common.redirectToLogin);
        },

        edit: function (page) {
            Array.prototype.forEach.call(page.querySelectorAll('[component="button/edit"]'), function (element) {
                element.onclick = function () {
                    element.style.display = 'none';
                    page.querySelector('[component="button/save"]').style.display = 'block';
                    Array.prototype.forEach.call(page.querySelectorAll('ons-list-item'), function (listitem) {
                        listitem.style.display = 'none';
                    });
                    Array.prototype.forEach.call(page.querySelectorAll('.edit'), function (edititem) {
                        edititem.style.display = 'block';
                    });
                };
            });
        },

        clearAll: function () {
            localStorage.clear();
            sessionStorage.clear();
        }

    },

    /////////////////////
    // User Service //
    ////////////////////
    user: {
        getInfo: function (response) {
            sessionStorage.setItem('isLoggedIn', true);
            localStorage.setItem('role', response.data[0]);
            ajax.send('get', '/api/all', '{}', myApp.services.user.setData, myApp.services.common.redirectToLogin);
        },

        setData: function (response) {
            localStorage.setItem('userData', JSON.stringify(response));
            myApp.services.user.setAppForUser();
        },

        setAppForUser: function () {
            if (myApp.user.isLandlord()) {
                if (myApp.user.flats()) {
                    if (myApp.user.currentFlat()) {
                        myNavigator.pushPage('splitter.html');
                    } else {
                        myNavigator.pushPage('html/flat/flat_info.html');
                    }
                } else {
                    myNavigator.pushPage('html/flat/flat_info.html');
                }
                console.log('config for landlord');
            } else if (myApp.user.isTenant()) {
                if (myApp.user.currentFlat()) {
                    myNavigator.pushPage('userSplitter.html');
                } else {
                    if (myApp.user.hasInvitation()) {
                        myNavigator.pushPage('html/dashboard.html');
                    } else {
                        myNavigator.pushPage('html/dashboard.html');
                    }
                }
                console.log('config for tenant')
            } else {
                myApp.services.common.clearAll();
                myApp.services.common.redirectToLogin();
            }
        },

        fill: function (page) {
            let card = page.querySelector('form'),
                userData = myApp.user.data(),
                phone = userData.phone ? userData.phone : 'Telefon',
                account = userData.account_number ? userData.account_number : 'Numer konta bankowago';

            let userInfo = ons.createElement(
                '<div>' +
                '<ons-list-item class="fullname">' + userData.fullname + '</ons-list-item>' +
                '<div class="edit" style="display: none;">' +
                '<ons-input name="firstname" modifier="underbar" placeholder="Imię" value="' + userData.firstname + '" float class="edit hidden"> </ons-input>' +
                '<ons-input id="lastname" modifier="underbar" placeholder="Nazwisko" value="' + userData.lastname + '" float class="edit hidden""></ons-input>' +
                '</div>' +
                '<ons-list-item class="phone">' + phone + '</ons-list-item>' +
                '<div class="edit" style="display: none">' +
                '<ons-input name="phone" modifier="underbar" placeholder="Telefon" value="' + phone + '" float class="edit hidden"> </ons-input>' +
                '</div>' +
                '<ons-list-item class="account_number">' + account + '</ons-list-item>' +
                '<div class="edit" style="display: none">' +
                '<ons-input name="phone" modifier="underbar" placeholder="Numer konta bankowego" value="' + account + '" float class="edit hidden"> </ons-input>' +
                '</div>' +
                '<ons-button style="display:none;" modifier="large" component="button/save">Zapisz</ons-button>' +
                '</div>'
                )
            ;

            userInfo.querySelector('ons-button').onclick = function () {
                myApp.services.user.save(page.querySelector('form'))
            };

            card.appendChild(userInfo);

            myApp.services.common.edit(page);

        },

        save: function (form) {
            console.log(form);
        },

        // Add user to flat
        add: function (flat, data) {

        },

        //Remove user from flat
        remove: function (flat, user) {

        }

    },

    /////////////////
    // Flat Service //
    /////////////////
    flat:
        {
            list: function (page, flats) {
                for (let id in flats) {
                    let flat = flats[id];
                    myApp.services.flat.item(page, flat);
                }
            },

            emptyList: function (page) {
                let info = ons.createElement('<div>Brak dodanych mieszkań - użyj przycisku by dodać mieszkanie.</div>');
                page.querySelector('.content').appendChild(info);
            },

            item: function (page, flat) {
                let name = flat.name ? flat.name : flat.street + ' ' + flat.building_number + ', ' + flat.city;
                let flatItem = ons.createElement(
                    '<div>' +
                    '<ons-list-item modifier="chevron" tappable>' + name + '</ons-list-item>' +
                    '</div>'
                );

                flatItem.querySelector('.center').onclick = function () {
                    myNavigator.pushPage('html/flat/flat_info.html',
                        {
                            animation: 'lift',
                            data: {
                                element: flat
                            }
                        });
                    localStorage.setItem('currentFlat', flat.id);
                };

                page.querySelector('.content').insertBefore(flatItem);
            },

            emptyFlatLandlord: function (page) {
                let info = ons.createElement('<div>Wybierz lub dodaj mieszkanie.</div>');
                page.querySelector('.content').appendChild(info);
                myApp.services.flat.list(page);
            },

            // Creates a new flat
            create: function (data) {

            }
            ,

            // Modifies the inner data and current view of an existing flat.
            update: function (flat, data) {

            }
            ,

            // Deletes a flat
            remove: function (taskItem) {

            }
        }
    ,

/////////////////////
// Bill Service //
////////////////////
    bill: {

        // Update bill
        update: function (bill, data) {

        }
        ,


        // Pay bill
        pay: function (bill) {

        }
        ,

        //Mark bill as paid
        markAsPaid: function (bill) {

        }

    }

}
;
