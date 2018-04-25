/***********************************************************************************
 * App Services. This contains the logic of the application organised in modules/objects. *
 ***********************************************************************************/

myApp.services = {

    token: {
        get: function (nextPage) {
            if (localStorage.getItem('token')) {
                return myApp.services.token.check(nextPage);
            } else {
                myApp.services.common.clearAll();
            }
        },
        check: function () {
            ajax.send('get', '/api/check', function (response) {
                sessionStorage.setItem('isLoggedIn', true);
                localStorage.setItem('role', response.data[0]);
            }, function () {
                sessionStorage.setItem('isLoggedIn', false);
                myNavigator.pushPage('html/auth/login.html');
            });
        }
    },

    common: {
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
            myNavigator.pushPage('html/auth/login.html');
        },

        setAppForUser: function () {
            var role = myApp.user.role();
            if (role === 'ROLE_LANDLORD') {
                console.log('config for landlord');
                //fillFlatList
            } else if (role === 'ROLE_TENANT') {
                console.log('config for tenant')
                //removeUnnecesaryElements
                //fillUserInfo
                //fillFlatInfo
            } else {
                myApp.services.common.clearAll();
            }
        }
    },

    /////////////////////
    // User Service //
    ////////////////////
    user: {

        authorizeSuccess: function (response, page) {
            var form = page.querySelector('form');
            myApp.user.set(form.querySelector('#username').value, form.querySelector('#password').value);
            myApp.user.setToken(response.token);

            ajax.send('get', '/api/check', function (response) {
                sessionStorage.setItem('isLoggedIn', true);
                localStorage.setItem('role', response.data[0]);
                ajax.send('get', '/api/all', function (response) {
                    localStorage.setItem('userData', JSON.stringify(response));
                    myNavigator.pushPage('splitter.html');
                    myApp.services.common.setAppForUser();
                }, function () {
                    myNavigator.pushPage('html/auth/login.html');
                });
            }, function () {
                sessionStorage.setItem('isLoggedIn', false);
                myNavigator.pushPage('html/auth/login.html');
            });


        },

        authorizeFail: function () {
            console.log('porażka!');
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
            list: function (page) {
                let flatsData = myApp.user.flats();
                for (let id in flatsData) {
                    let flat = flatsData[id];
                    myApp.services.flat.item(page, flat);
                }
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
