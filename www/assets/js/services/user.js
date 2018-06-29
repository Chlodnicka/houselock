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

    display: function (page, id) {
        if (id) {
            myApp.user.get(id).once('value').then(function (user) {
                myApp.services.user.fill(page, user.val());
            });
        } else {
            myApp.user.current().once('value').then(function (user) {
                myApp.services.user.fill(page, user.val());
            });
        }
    },

    fill: function (page, userData) {
        let card = page.querySelector('form'),
            phone = userData.phone ? userData.phone : '',
            account = userData.account_number ? userData.account_number : '',
            username = userData.username ? userData.username : '';

        let status = '';
        if (userData.status) {
            status = '<ons-list-item>' + myApp.services.common.parseStatus(userData.status) + '</ons-list-item>'
        }

        let userInfo = ons.createElement(
            '<div>' +
            status +
            '<ons-list-item class="fullname">Imię i nazwisko: ' + userData.username + '</ons-list-item>' +
            '<div class="edit" style="display: none;">' +
            '<ons-input id="username" name="username" modifier="underbar" placeholder="Imię i nazwisko" value="' + username + '" float class="edit hidden"> </ons-input>' +
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
            '<ons-button class="cancel-btn" style="display:none;" modifier="large" component="button/cancel">Anuluj</ons-button>' +
            '</div>'
            )
        ;

        userInfo.querySelector('[component="button/save"]').onclick = function () {
            myApp.services.user.update(page)
        };


        card.appendChild(userInfo);

        myApp.services.common.edit(page);
        myApp.services.common.cancel(page);

        if (myApp.user.isTenant() && userData.status !== 'DELETED_BY_SELF') {
            let deleteButton = ons.createElement(
                '<ons-button component="button/remove-self">Odepnij się od mieszkania</ons-button>'
            );

            deleteButton.onclick = function () {
                ajax.send('post', '/api/user/remove', {}, myApp.services.user.ignoreUpdate)
            };

            page.querySelector('.content').appendChild(deleteButton);
        }
    },

    update: function (page) {
        myApp.user.current().once('value').then(function (userSnapshot) {
            let userData = $.extend({}, userSnapshot.val(), form.serialize(page))
            console.log(userData);
            firebase.database().ref('users/' + myApp.user.id()).set(userData).then(function () {
                myApp.user.splitter();
            }).catch(
                //error
            );
        });
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

        let status = user.status ? myApp.services.common.parseStatus(user.status) : '';

        let userItem = ons.createElement(
            '<div>' +
            '<ons-list-item modifier="chevron" tappable>' + name + ' (' + status + ')</ons-list-item>' +
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

    acceptRemoval: function () {
        ajax.send('post', '/api/user/remove', {}, myApp.services.user.ignoreUpdate);
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
                    title: 'Ta akcja jest nieodwracalna!',
                    cancelable: true,
                    buttons: [
                        {
                            label: 'Usuń lokatora',
                            modifier: 'destructive'
                        },
                        {
                            label: 'Anuluj'
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