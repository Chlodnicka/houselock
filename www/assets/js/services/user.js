/////////////////////
// User Service //
////////////////////
myApp.services.user = {
    getInfo: function (response) {
        sessionStorage.setItem('isLoggedIn', true);
        localStorage.setItem('role', response.data[0]);
        ajax.send('get', '/api/all', '{}', myApp.services.user.setData, myApp.services.common.redirectToLogin);
    },

    setData: function (response) {
        localStorage.setItem('userData', JSON.stringify(response));
        if (myApp.user.isTenant()) {
            let flats = myApp.user.flats();
            let id = Object.keys(flats)[0];
            if (id) {
                myApp.services.common.setCurrentFlat(id);
            }
        }
        myApp.services.user.setAppForUser();
    },

    setAppForUser: function () {
        if (myApp.user.isLandlord()) {
            if (myApp.user.flats()) {
                if (myApp.user.currentFlat()) {
                    myNavigator.pushPage('landlordSplitter.html');
                } else {
                    myNavigator.pushPage('html/flat/flat_info.html');
                }
            } else {
                myNavigator.pushPage('html/flat/flat_info.html');
            }
        } else if (myApp.user.isTenant()) {
            if (myApp.user.currentFlat()) {
                myNavigator.pushPage('tenantSplitter.html');
            } else {
                if (myApp.user.hasInvitation()) {
                    myNavigator.pushPage('html/user/user_accept_invitation.html');
                } else {
                    myNavigator.pushPage('html/user/dashboard.html');
                }
            }
        } else {
            myApp.services.common.clearAll();
            myApp.services.common.redirectToLogin();
        }
    },

    fill: function (page, data) {
        let card = page.querySelector('form'),
            userData = data ? data : myApp.user.data(),
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

        userInfo.querySelector('[component="button/save"]').onclick = function () {
            myApp.services.user.save(page.querySelector('form'))
        };

        card.appendChild(userInfo);

        myApp.services.common.edit(page);

    },

    save: function (form) {
        console.log(form);
    },

    list: function (page, users) {
        for (let id in users) {
            let user = users[id];
            myApp.services.user.item(page, user);
        }
    },

    emptyList: function (page) {
        let info = ons.createElement('<div>Brak lokatorów. Dodaj ich do mieszkania.</div>');
        page.querySelector('.content').appendChild(info);
    },

    item: function (page, user) {

        let name = user.lastname ? user.firstname + ' ' + user.lastname : user.email;

        let userItem = ons.createElement(
            '<div>' +
            '<ons-list-item modifier="chevron" tappable>' + name + '</ons-list-item>' +
            '</div>'
        );


        userItem.querySelector('.center').onclick = function () {
            myNavigator.pushPage('html/user/tenant_info.html',
                {
                    animation: 'lift',
                    data: {
                        element: user
                    }
                });
        };

        page.querySelector('.content').insertBefore(userItem);
    },

    // Add user to flat
    addSuccess: function (response) {
        console.log(response);
    }

};