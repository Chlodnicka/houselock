/////////////////////
// User Service //
////////////////////
myApp.services.user = {

    create: function(data) {
        myApp.user.create(data).then(function() {
            myApp.user.getInvitatonByEmail(data.email).once("value", function(invitationSnapshot) {
                let invitationsData = invitationSnapshot.val();
                if (invitationsData) {
                    let id = Object.keys(invitationsData);
                    if (invitationsData[id] && invitationsData[id].status === 'NEW') {
                        let userId = myApp.user.id();
                        myApp.flat.addTenant(userId, invitationsData[id].flat, id);
                    }
                }
            });
        }).catch(function(error) {
            console.log(error);
        });
    },

    userAlerts: function(page) {
        myApp.user.alerts().once('value').then(snapshot => {
            snapshot.forEach(function(child) {
                let alerts = [];
                if (child.val().status === 'NEW') {
                    alerts.push(child.val());
                }

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

                alertButton.onclick = function() {
                    myNavigator.pushPage('html/alerts.html')
                };

                page.querySelector('.alert-container').appendChild(alertButton);


            });
        });
    },

    fillAlerts: function(page, alerts) {
        for (let id in alerts) {
            let message = alerts[id].message;
            let date = new Date(alerts[id].date);

            let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

            myApp.flat.get(alerts[id].flat).once('value').then(function(flatSnapshot) {
                let address = myApp.services.common.parseAddress(flatSnapshot.val());
                let alert = ons.createElement(
                    '<ons-card data-id="' + id + '" >' +
                    '<div style="display: flex; margin-bottom: 10px;">' +
                    '<div style="font-size: 10px; width: 50%;">Mieszkanie: ' + address + '</div>' +
                    '<div style="font-size: 10px; width: 50%; text-align: right;">' + date.toLocaleDateString('pl-PL', options) + '</div>' +
                    '</div>' +
                    '<div style="display: flex; margin-bottom: 10px;">' +
                    message +
                    '</div>' +
                    '</ons-card>'
                );

                alert.onclick = function() {
                    myApp.services.user.alertSeen(page, $(this));
                };

                page.querySelector('.alerts-list').appendChild(alert);
            });
        }
    },

    alertSeen: function(page, element) {
        let siblings = element.siblings();
        let id = element.attr('data-id');
        element.remove();
        let update = {};
        update['/alerts/' + id + '/status'] = 'SEEN';

        return firebase.database().ref().update(update, function(error) {
            if (error) {
                console.log(error);
            } else {
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
            }
        });
    },

    showAlerts: function(element) {
        document
            .getElementById('alert_popover')
            .show(element);
    },

    display: function(page, id) {
        if (id) {
            myApp.user.get(id).once('value').then(function(user) {
                myApp.services.user.fill(page, user.val());
            });
        } else {
            myApp.user.current().once('value').then(function(user) {
                myApp.services.user.fill(page, user.val());
            });
        }
    },

    fill: function(page, userData) {
        let card = page.querySelector('form'),
            phone = userData.phone ? userData.phone : '',
            account = userData.account_number ? userData.account_number : '',
            firstname = userData.firstname ? userData.firstname : '',
            lastname = userData.lastname ? userData.lastname : '';

        let status = '';
        if (userData.status) {
            status = '<ons-list-item>STATUS: ' + myApp.services.common.parseStatus(userData.status) + '</ons-list-item>'
        }

        let userInfo = ons.createElement(
            '<div>' +
            status +
            '<ons-list-item class="firstname">Imię: ' + userData.firstname + '</ons-list-item>' +
            '<div class="edit" style="display: none;">' +
            '<ons-input id="firstname" name="firstname" modifier="underbar" placeholder="Imię" value="' + firstname + '" float class="edit hidden"> </ons-input>' +
            '</div>' +
            '<ons-list-item class="lastname">Nazwisko: ' + userData.lastname + '</ons-list-item>' +
            '<div class="edit" style="display: none;">' +
            '<ons-input id="lastname" name="lastname" modifier="underbar" placeholder="Nazwisko" value="' + lastname + '" float class="edit hidden"> </ons-input>' +
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
        );

        userInfo.querySelector('[component="button/save"]').onclick = function() {
            myApp.services.user.update(page);
        };


        card.appendChild(userInfo);

        myApp.services.common.edit(page);
        myApp.services.common.cancel(page);

        myApp.user.current().once('value').then(function(userSnapshot) {
            let user = userSnapshot.val();
            if (myApp.user.isTenant(user.role) && user.status !== 'DELETED_BY_SELF') {
                let deleteButton = ons.createElement(
                    '<ons-button component="button/remove-self">Odepnij się od mieszkania</ons-button>'
                );

                deleteButton.onclick = function() {
                    let userId = myApp.user.id();
                    myApp.user.setDeleted(userId);
                };

                page.querySelector('.content').appendChild(deleteButton);
            }
        });

    },

    update: function(page) {
        myApp.user.current().once('value').then(function(userSnapshot) {
            let userData = $.extend({}, userSnapshot.val(), form.serialize(page))
            if (myApp.services.validation.validateUserData(userData)) {
                firebase.database().ref('users/' + myApp.user.id()).set(userData).then(function() {
                    myApp.user.splitter();
                }).catch(
                    //error
                );
            }
        });
    },

    addTenant: function(page) {
        let user = form.serialize(page);
        myApp.user.getByEmail(user.email).once("value", function(userSnapshot) {
            if (userSnapshot.val()) {
                let usersData = userSnapshot.val();
                let id = Object.keys(usersData);
                if (usersData[id].flat || myApp.user.isLandlord(usersData[id].role)) {
                    ons.notification.alert({ message: "Nie możesz zaprosić do mieszkania użytkownika, który ma mieszkanie lub jest właścicielem mieszkania" });
                } else {
                    let flatId = myApp.services.flat.current();
                    myApp.flat.addTenant(id, flatId);
                }
            } else {
                myApp.user.invitation(user.email);
            }
        });
    },

    list: function(page) {
        myApp.flat.tenants().once('value').then(function(tenants) {
            myApp.flat.invitations().once('value').then(function(invitationsInfo) {
                if (tenants.numChildren() === 0 && invitationsInfo.numChildren() === 0) {
                    myApp.services.user.emptyList(page);
                } else {
                    if (tenants.numChildren() > 0) {
                        tenants.forEach(function(tenant) {
                            let userId = tenant.key;
                            myApp.user.get(userId).once('value').then(function(user) {
                                myApp.services.user.item(page, user.val(), userId);
                            });
                        });
                    }

                    if (invitationsInfo.numChildren() > 0) {
                        invitationsInfo.forEach(function(invitation) {
                            let invitationId = invitation.key;
                            myApp.user.invitationInfo(invitationId).once('value').then(function(invitationInfo) {
                                if (invitationInfo.val().status === 'NEW') {
                                    myApp.services.user.item(page, invitationInfo.val());
                                }
                            });
                        });
                    }
                }
            });
        });
    },

    emptyList: function(page) {
        let info = ons.createElement('<div>Brak lokatorów. Dodaj ich do mieszkania.</div>');
        let container = page.querySelector('.content');
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        container.appendChild(info);
    },

    item: function(page, user, id) {

        let name = user.lastname ? user.firstname + ' ' + user.lastname : user.email;

        let status = user.status ? myApp.services.common.parseStatus(user.status) : '';

        let modifier = '';

        if (id) {
            modifier = ' modifier="chevron" tappable ';
        }

        let userItem = ons.createElement(
            '<div>' +
            '<ons-list-item' + modifier + '>' + name + ' (' + status + ')</ons-list-item>' +
            '</div>'
        );

        if (id) {
            user['id'] = id;

            userItem.querySelector('.center').onclick = function() {
                myNavigator.pushPage('html/user/tenant_info.html', {
                    animation: 'lift',
                    data: {
                        element: user
                    }
                });
            };
        }

        page.querySelector('.content').insertBefore(userItem);
    },

    accept: function() {
        let updates = {};
        let userId = myApp.user.id();
        updates['/users/' + userId + '/status/'] = 'ACTIVE';

        return firebase.database().ref().update(updates, function(error) {
            if (error) {
                console.log(error)
            } else {
                myApp.user.splitter();
            }
        });
    },

    ignore: function() {
        let userId = myApp.user.id();
        myApp.user.setDeleted(userId);
    },

    remove: function(page, info) {
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/remove-tenant"]'), function(element) {
            element.onclick = function() {
                ons.openActionSheet({
                    title: 'Ta akcja jest nieodwracalna!',
                    cancelable: true,
                    buttons: [{
                            label: 'Usuń lokatora',
                            modifier: 'destructive'
                        },
                        {
                            label: 'Anuluj'
                        }
                    ]
                }).then(function(index) {
                    if (index === 0) {
                        let userId = info.id;
                        myApp.user.setDeleted(userId);
                    }
                });
            };
        });
    },

    acceptRemoval: function() {
        let userId = myApp.user.id();
        myApp.user.setDeleted(userId);
    }

};