/////////////////////
// User Service //
////////////////////
myApp.services.user = {

    userAlerts: function (page) {
        let alerts = myApp.user.alerts();

        let alertButton = ons.createElement(
            '<ons-button id="alert-button" component="button/show-alerts" style="background: transparent;color: black;" disabled>' +
            '<ons-icon icon="md-notifications-none"></ons-icon>' +
            '</ons-button>'
        );

        if (Object.keys(alerts).length > 0) {
            alertButton = ons.createElement(
                '<ons-button id="alert-button" component="button/show-alerts"  style="background: transparent;color: black;">' +
                '<ons-icon icon="md-notifications-active"></ons-icon>' +
                '</ons-button>'
            );

        }

        alertButton.onclick = function () {
            myNavigator.pushPage('html/alerts.html')
        };

        page.querySelector('.alert-container').appendChild(alertButton);
    },

    fillAlerts: function (page, alerts) {

        for (let id in alerts) {
            let message = myApp.services.common.parseAlertMessage(alerts[id].type);
            let address = myApp.flat.getAddress(alerts[id].flat);
            alert = ons.createElement(
                '<ons-card data-id="' + alerts[id].id + '" ' +
                'data-flat-id="' + alerts[id].flat + '">' +
                '<div style="display: flex; margin-bottom: 10px;">' +
                '<div style="font-size: 10px; width: 50%;">Mieszkanie: ' + address + '</div>' +
                '<div style="font-size: 10px; width: 50%; text-align: right;">' + alerts[id].created_at + '</div>' +
                '</div>' +
                message +
                '</ons-card>'
            );

            alert.onclick = function () {
                myApp.services.user.alertSeen(page, $(this));
            };

            page.querySelector('.alerts-list').appendChild(alert);
        }
    },

    alertSeen: function (page, element) {
        let siblings = element.siblings();
        let userData = myApp.user.userData();
        let id = element.attr('data-id');
        element.remove();
        delete userData.data.alerts[id];
        localStorage.setItem('userData', JSON.stringify(userData));
        ajax.send('post', '/api/alert/seen/' + element.attr('data-id'), {});

        if (siblings.length === 0) {

            let noAlerts = ons.createElement(
                '<ons-card style="text-align: center">' +
                'Brak powiadomień' +
                '<div class="no-alerts">' +
                '<ons-icon icon="md-notifications-off" size="144px"></ons-icon>' +
                '</div>' +
                '</ons-card>'
            );

            page.querySelector('.alerts-list').appendChild(noAlerts);

            $(document).find('.alert-container').find('#alert-button').remove();

            let alertButton = ons.createElement(
                '<ons-button id="alert-button" component="button/show-alerts" style="background: transparent;color: black;" disabled>' +
                '<ons-icon icon="md-notifications-none"></ons-icon>' +
                '</ons-button>'
            );

            $(document).find('.alert-container').append(alertButton);
        }
    },

    showAlerts: function (element) {
        document
            .getElementById('alert_popover')
            .show(element);
    },

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
                localStorage.setItem('currentFlat', id);
                ajax.send('get', '/api/flat/' + id, '{}', myApp.services.common.updateFlatInvitation);
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
            '<ons-input id="firstname" name="firstname" modifier="underbar" placeholder="Imię" value="' + userData.firstname + '" float class="edit hidden"> </ons-input>' +
            '<ons-input id="lastname" modifier="underbar" placeholder="Nazwisko" value="' + userData.lastname + '" float class="edit hidden""></ons-input>' +
            '</div>' +
            '<ons-list-item class="phone">Telefon: ' + phone + '</ons-list-item>' +
            '<div class="edit" style="display: none">' +
            '<ons-input name="phone" id="phone" modifier="underbar" placeholder="Telefon" value="' + phone + '" float class="edit hidden"> </ons-input>' +
            '</div>' +
            '<ons-list-item class="account_number">Numer konta bankowego: ' + account + '</ons-list-item>' +
            '<div class="edit" style="display: none">' +
            '<ons-input name="account_number"  id="account_number" modifier="underbar" placeholder="Numer konta bankowego" value="' + account + '" float class="edit hidden"> </ons-input>' +
            '</div>' +
            '<ons-button style="display:none;" modifier="large" component="button/save">Zapisz</ons-button>' +
            '<ons-button style="display:none;" modifier="large" component="button/cancel">Anuluj</ons-button>' +
            '</div>'
            )
        ;

        userInfo.querySelector('[component="button/save"]').onclick = function () {
            myApp.services.user.save(page)
        };


        card.appendChild(userInfo);

        myApp.services.common.edit(page);
        myApp.services.common.cancel(page);

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

    remove: function (page, info) {
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/remove-tenant"]'), function (element) {
            element.onclick = function () {
                ons.openActionSheet({
                    title: 'Usuń lokatora',
                    cancelable: true,
                    buttons: [
                        {
                            label: 'Usuń',
                            modifier: 'destructive'
                        },
                        {
                            label: 'Anuluj',
                            icon: 'md-close'
                        }
                    ]
                }).then(function (index) {
                    if (index === 0) {
                        ajax.send('post', '/api/user/' + info.id + '/remove', {}, myApp.services.common.updateFlat);
                    }
                });
            };
        });
    }
};