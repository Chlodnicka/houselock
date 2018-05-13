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
            let flats = myApp.user.flats();
            let id = Object.keys(flats)[0];
            if (id && myApp.user.status() === 'ACTIVE') {
                myApp.services.common.setCurrentFlat(id);
            } else if (myApp.user.hasInvitation()) {
                myNavigator.pushPage('html/user/user_accept_invitation.html');
            } else {
                myNavigator.pushPage('html/user/user_no_flat.html');
            }
        } else {
            myApp.services.common.clearAll();
            myApp.services.common.redirectToLogin();
        }
    },

    fill: function (page, data) {
        let card = page.querySelector('form'),
            userData = data ? data : myApp.user.data(),
            phone = userData.phone ? userData.phone : '',
            account = userData.account_number ? userData.account_number : '';

        let userInfo = ons.createElement(
            '<div>' +
            '<ons-list-item class="fullname">Imię i nazwisko: ' + userData.fullname + '</ons-list-item>' +
            '<div class="edit" style="display: none;">' +
            '<label for="firstname">Imię</label>' +
            '<ons-input id="firstname" name="firstname" modifier="underbar" placeholder="Imię" value="' + userData.firstname + '" float class="edit hidden"> </ons-input>' +
            '<label for="lastname">Nazwisko</label>' +
            '<ons-input id="lastname" modifier="underbar" placeholder="Nazwisko" value="' + userData.lastname + '" float class="edit hidden""></ons-input>' +
            '</div>' +
            '<ons-list-item class="phone">Telefon: ' + phone + '</ons-list-item>' +
            '<div class="edit" style="display: none">' +
            '<label for="phone">Telefon</label>' +
            '<ons-input name="phone" id="phone" modifier="underbar" placeholder="" value="' + phone + '" float class="edit hidden"> </ons-input>' +
            '</div>' +
            '<ons-list-item class="account_number">Numer konta bankowego: ' + account + '</ons-list-item>' +
            '<div class="edit" style="display: none">' +
            '<label for="account_number">Numer konta</label>' +
            '<ons-input name="account_number"  id="account_number" modifier="underbar" placeholder="" value="' + account + '" float class="edit hidden"> </ons-input>' +
            '</div>' +
            '<ons-button style="display:none;" modifier="large" component="button/save">Zapisz</ons-button>' +
            '<ons-button style="display:none;" modifier="large" component="button/cancel">Anuluj</ons-button>' +
            '</div>'
            )
        ;

        userInfo.querySelector('[component="button/save"]').onclick = function () {
            myApp.services.user.save(page)
        };

        userInfo.querySelector('[component="button/cancel"]').onclick = function () {
            myApp.services.common.cancel(page)
        };

        card.appendChild(userInfo);

        myApp.services.common.edit(page);

    },

    save: function (page) {
        ajax.sendForm(page, myApp.services.common.updateUser);
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

    accept: function () {
        ajax.send('post', '/api/user/accept', {}, myApp.services.common.updateUser);
    },

    ignore: function () {
        ajax.send('post', '/api/user/ignore', {}, myApp.services.user.ignoreUpdate);
    },

    ignoreUpdate: function (response) {
        let data = JSON.stringify(response);
        localStorage.setItem('userData', data);
        localStorage.removeItem('currentFlat');
        localStorage.removeItem('flatData');
        myNavigator.pushPage('html/user/user_no_flat.html');
    },

    // Add user to flat
    addSuccess: function (response) {
        console.log(response);
    }

};