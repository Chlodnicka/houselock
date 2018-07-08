/////////////////
// Flat Service //
/////////////////
myApp.services.flat = {

    create: function (page) {
        let data = form.serialize(page);
        let flatKey = firebase.database().ref().child('flats').push().key;
        let updates = {};
        updates['/flats/' + flatKey] = data;
        updates['/users/' + myApp.user.id() + '/flats/' + flatKey] = true;
        return firebase.database().ref().update(updates, function (error) {
            if (error) {
                console.log(error)
            } else {
                myApp.services.flat.setCurrent(flatKey);
                myNavigator.pushPage('landlordSplitter.html');
            }
        });
    },

    setCurrent: function (id) {
        localStorage.setItem('currentFlat', id);
    },

    current: function () {
        return localStorage.getItem('currentFlat');
    },

    display: function (page, id) {
        return firebase.database().ref('/flats/' + id).once('value').then(function (snapshot) {
            let flat = snapshot.val();
            flat['id'] = id;
            myApp.services.flat.displayFlat(page, flat);
            myApp.services.flat.displayActions(page, flat);
        }).catch(function (error) {
            console.log(error);
        });
    },

    displayFlat: function (page, info) {

        let mediaTemplate = '';

        if (info.config) {
            let gasChecked = info.config.gas ? ' checked ' : '';
            let powerChecked = info.config.power ? ' checked ' : '';
            let waterChecked = info.config.water ? ' checked ' : '';
            let wastesChecked = info.config.wastes ? ' checked ' : '';


            let gasPrice = gasChecked ? info.config.gas.value : '';
            let powerPrice = powerChecked ? info.config.power.value : '';
            let waterPrice = waterChecked ? info.config.water.value : '';
            let wastesPrice = wastesChecked ? info.config.wastes.value : '';


            mediaTemplate =
                '<div class="edit hidden" style="display: none">' +
                '<ons-list-header>Ustawienia mediów</ons-list-header>' +

                '<div class="edit hidden" style="display: none; margin-bottom: 30px;">' +
                '<div style="display:flex; margin: 20px 0;">' +
                '<label class="config-left" for="config.gas">' +
                'Gaz: ' +
                '</label>' +
                '<ons-checkbox class="config-right" id="config.gas" ' + gasChecked + ' name="config.gas" modifier="underbar" float class="edit hidden" value="config.gas"></ons-checkbox>' +
                '</div>' +
                '<div style="display:flex; margin: 20px 0;">' +
                '<label  class="config-left" for="config.gas.type">Sposób rozliczenia:</label>' +
                '<ons-select  style="margin-top: -7px;" class="config-right" id="config.gas.type" name="config.gas.type">' +
                myApp.services.common.selectOption(info.config.gas) +
                '</ons-select>' +
                '</div>' +
                '<ons-input id="config.gas.value" modifier="underbar" placeholder="Kwota" float class="edit hidden" value="' + gasPrice + '"></ons-input>' +
                '</div>' +

                '<div class="edit hidden" style="display: none; margin-bottom: 30px;">' +
                '<div style="display:flex; margin: 20px 0;">' +
                '<label class="config-left" for="config.power">Prąd</label>' +
                '<ons-checkbox class="config-right" id="config.power" ' + powerChecked + ' name="config.power" modifier="underbar" float class="edit hidden" value="config.power"></ons-checkbox>' +
                '</div>' +
                '<div style="display:flex; margin: 20px 0;">' +
                '<label class="config-right" for="config.power.type">Sposób rozliczenia:</label>' +
                '<ons-select class="config-left" id="config.power.type" name="config.power.type">' +
                myApp.services.common.selectOption(info.config.power) +
                '</ons-select>' +
                '</div>' +
                '<ons-input id="config.power.value" modifier="underbar" placeholder="Kwota" float class="edit hidden" value="' + powerPrice + '"></ons-input>' +
                '</div>' +

                '<div class="edit hidden" style="display: none; margin-bottom: 30px;">' +
                '<div style="display:flex; margin: 20px 0;">' +
                '<label class="config-left" for="config.wastes">Śmieci</label>' +
                '<ons-checkbox class="config-right" id="config.wastes" ' + wastesChecked + ' name="config" modifier="underbar" float class="edit hidden" value="config.wastes"></ons-checkbox>' +
                '</div>' +
                '<div style="display:flex; margin: 20px 0;">' +
                '<label class="config-left" for="config.wastes.type">Sposób rozliczenia:</label>' +
                '<ons-select class="config-right" id="config.wastes.type" name="config.wastes.type">' +
                myApp.services.common.selectOption(info.config.wastes) +
                '</ons-select>' +
                '</div>' +
                '<ons-input id="config.wastes.value" modifier="underbar" placeholder="Kwota" float class="edit hidden" value="' + wastesPrice + '"></ons-input>' +
                '</div>' +

                '<div class="edit hidden" style="display: none; margin-bottom: 30px;">' +
                '<div style="display:flex; margin: 20px 0;">' +
                '<label class="config-left" for="config.water">Woda</label>' +
                '<ons-checkbox class="config-right" id="config.water" ' + waterChecked + ' name="config" modifier="underbar" float class="edit hidden" value="config.water"></ons-checkbox>' +
                '</div>' +
                '<div style="display:flex; margin: 20px 0;">' +
                '<label class="config-left" for="config.water.type">Sposób rozliczenia:</label>' +
                '<ons-select class="config-right" id="config.water.type" name="config.water.type">' +
                myApp.services.common.selectOption(info.config.water) +
                '</div>' +
                '<ons-input id="config.water.value" modifier="underbar" placeholder="Kwota" float class="edit hidden" value="' + waterPrice + '"></ons-input>' +
                '</div></div>' +

                '<div class="config_info">' +
                '<div id="gas_config">' +
                '<ons-list-header>Gaz</ons-list-header>' +
                '<ons-list-item>Sposób rozliczenia: ' + myApp.services.common.getTextFromOption(info.config.gas) + '</ons-list-item>' +
                '<ons-list-item>Kwota: ' + gasPrice + '</ons-list-item></br>' +
                '</div>' +
                '<div id="power_config">' +
                '<ons-list-header>Prąd</ons-list-header>' +
                '<ons-list-item>Sposób rozliczenia: ' + myApp.services.common.getTextFromOption(info.config.power) + '</ons-list-item>' +
                '<ons-list-item>Kwota: ' + powerPrice + '</ons-list-item>' +
                '</div>' +
                '<div id="wastes_config">' +
                '<ons-list-header>Śmieci</ons-list-header>' +
                '<ons-list-item>Sposób rozliczenia: ' + myApp.services.common.getTextFromOption(info.config.wastes) + '</ons-list-item>' +
                '<ons-list-item>Kwota: ' + wastesPrice + '</ons-list-item>' +
                '</div>' +
                '<div id="water_config">' +
                '<ons-list-header>Woda</ons-list-header>' +
                '<ons-list-item>Sposób rozliczenia: ' + myApp.services.common.getTextFromOption(info.config.water) + '</ons-list-item>' +
                '<ons-list-item>Kwota: ' + waterPrice + '</ons-list-item>' +
                '</div>' +
                '</div>';
        }


        let name = info.name ? info.name : 'Brak nazwy';

        let flat = ons.createElement(
            '<form data-ajax="/api/flat/' + info.id + '" method="post" id="flat_info_save" class="edit-flat">' +
            '<div><ons-card><ons-list-header>' + name + '</ons-list-header>' +
            '<ons-list-item><div>Adres:  </div><div>ul. ' + info.street + ' ' + info.building_number + '/' + info.flat_number + '</div></ons-list-item>' +
            '<div class="edit" style="display: none">' +
            '<ons-input id="street" name="street" modifier="underbar" minLength="1" maxLength="50" placeholder="Ulica" value="' + info.street + '" float class="edit hidden"> </ons-input>' +
            '<ons-input id="building_number" name="building_number" min="1" max="1000" modifier="underbar" placeholder="Numer budynku" value="' + info.building_number + '" float class="edit hidden"> </ons-input>' +
            '<ons-input id="flat_number" name="flat_number" modifier="underbar" placeholder="Numer mieszkania" value="' + info.flat_number + '" float class="edit hidden"> </ons-input>' +
            '</div>' +
            '<ons-list-item>Miasto i kod pocztowy:  ' + info.city + ' ' + info.postal_code + '</ons-list-item>' +
            '<div class="edit" style="display: none">' +
            '<ons-input id="city" name="city" modifier="underbar" placeholder="Miasto" value="' + info.city + '" float class="edit hidden"> </ons-input>' +
            '<ons-input id="postal_code" name="postal_code" modifier="underbar" placeholder="Kod pocztowy" value="' + info.postal_code + '" float class="edit hidden"> </ons-input>' +
            '</div>' +
            '<ons-list-item>Kwota za wynajem:  ' + info.mercenary + ' PLN</ons-list-item>' +
            '<div class="edit" style="display: none">' +
            '<ons-input id="mercenary" name="mercenary" modifier="underbar" placeholder="Kwota za wynajem" value="' + info.mercenary + '" float class="edit hidden"> </ons-input>' +
            '</div>' +
            '<ons-list-item>Dzień płatności:  ' + info.pay_day + '</ons-list-item>' +
            '<div class="edit" style="display: none">' +
            '<ons-input id="pay_day" name="pay_day" modifier="underbar" placeholder="Dzien płatności" value="' + info.pay_day + '" float class="edit hidden"> </ons-input>' +
            '</div>' +
            '</ons-card>' +

            '<ons-card>' +

            mediaTemplate +

            '<ons-button class="btn btn-danger" style="display:none;" modifier="large" component="button/save">Zapisz</ons-button>' +
            '<ons-button class="btn btn-secondary cancel-btn" style="display:none;" modifier="large" component="button/cancel">Anuluj</ons-button>' +
            '</ons-card>' +
            '</form>'
        );
        page.querySelector('.content').appendChild(flat);

        page.querySelector('[component="button/save"]').onclick = function () {
            myApp.services.flat.update(page)
        };
        myApp.services.common.edit(page);
        myApp.services.common.cancel(page);
    },

    displayActions: function (page, info) {

        let actions = ons.createElement(
            '<ons-speed-dial position="bottom right" direction="up">' +
            '    <ons-fab class="fab-colors">' +
            '      <ons-icon icon="md-share"></ons-icon>' +
            '    </ons-fab>' +
            '    <ons-speed-dial-item class="fab-colors" component="button/flat-edit">' +
            '      <ons-icon icon="md-edit"></ons-icon>' +
            '    </ons-speed-dial-item>' +
            '    <ons-speed-dial-item class="fab-colors" component="button/flat-remove">' +
            '      <ons-icon icon="md-delete"></ons-icon>' +
            '    </ons-speed-dial-item>' +
            '  </ons-speed-dial>'
        );

        page.querySelector('.content').appendChild(actions);

        Array.prototype.forEach.call(page.querySelectorAll('[component="button/flat-edit"]'), function (element) {
            element.onclick = function () {
                element.style.display = 'none';
                page.querySelector('[component="button/save"]').style.display = 'block';
                page.querySelector('[component="button/cancel"]').style.display = 'block';
                page.querySelector('div.config_info').style.display = 'none';
                Array.prototype.forEach.call(page.querySelectorAll('form ons-list-item'), function (listitem) {
                    listitem.style.display = ' none';
                });
                Array.prototype.forEach.call(page.querySelectorAll('form .edit'), function (edititem) {
                    edititem.style.display = 'block';
                });
            };
        });
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/flat-remove"]'), function (element) {
            element.onclick = function () {
                myApp.services.flat.remove(info);
            };
        });
    },

    list: function (page) {
        myApp.user.flats().once('value').then(function (userFlats) {
            myApp.services.flat.addAction(page);
            if (userFlats.numChildren() === 0) {
                myApp.services.flat.emptyList(page);
            } else {
                userFlats.forEach(function (userFlat) {
                    let flatId = userFlat.key;
                    myApp.flat.get(flatId).once('value').then(function (flat) {
                        myApp.services.flat.item(page, flatId, flat.val());
                    });
                    page.querySelector('.flat-list').style.display = 'block';
                });
            }
        }).catch(function (error) {
            console.log(error);
        });
    },

    emptyList: function (page) {
        let info = ons.createElement('<div>Brak dodanych mieszkań - użyj przycisku by dodać mieszkanie.</div>');
        page.querySelector('.flat-list').appendChild(info);
    },

    item: function (page, id, flat) {
        let name = flat.name ? flat.name : flat.street + ' ' + flat.building_number + ', ' + flat.city;
        let flatItem = ons.createElement(
            '<div>' +
            '<ons-list-item modifier="chevron" tappable>' + name + '</ons-list-item>' +
            '</div>'
        );


        flatItem.querySelector('.center').onclick = function () {
            myApp.services.flat.setCurrent(id);
            myNavigator.pushPage('landlordSplitter.html');
        };

        page.querySelector('.flat-list').appendChild(flatItem);
    },

    addAction: function (page) {
        let createFlat = ons.createElement(
            '<ons-fab class="fab-colors" position="bottom right" component="button/new-flat">' +
            '<ons-icon icon="md-plus"></ons-icon>' +
            '</ons-fab>'
        );

        createFlat.onclick = function () {
            document.querySelector('#myNavigator').pushPage('html/flat/flat_new.html');
        };

        page.querySelector('.content').appendChild(createFlat);
    },

    update: function (page) {
        myApp.flat.current().once('value').then(function (flatSnapshot) {
            let flatData = $.extend({}, flatSnapshot.val(), form.serialize(page));
            firebase.database().ref('flats/' + myApp.services.flat.current()).set(flatData).then(function () {
                myApp.user.splitter();
            }).catch(
                //error
            );
        });
    },

    /*
    Dotąd jest ok
     */

    emptyFlatLandlord: function (page) {
        let info = ons.createElement('<div>Wybierz lub dodaj mieszkanie.</div>');
        page.querySelector('.flat-list').appendChild(info);
        myApp.services.flat.list(page);
    },

    onCreatedSuccess: function (response) {
        let data = JSON.stringify(response);
        localStorage.setItem('userData', data);
        let highest = response.data.user_flats[Object.keys(response.data.user_flats).sort().pop()].id;
        myApp.services.common.setCurrentFlat(highest);
    },

    onCreateFail: function () {
        ons.notification.alert({message: 'Nie udało się dodać mieszkania!'});
    },

    updatedFailed: function () {

    },

    remove: function (flat) {
        ons.openActionSheet({
            title: 'Ta akcja jest nieodwracalna!',
            cancelable: true,
            buttons: [{
                label: 'Usuń mieszkanie',
                modifier: 'destructive'
            },
                {
                    label: 'Anuluj',
                }
            ]
        }).then(function (index) {
            if (index === 0) {
                if(flat.tenants && Object.keys(flat.tenants).length > 0) {
                    ons.notification.alert({message: "Nie możesz usunąć mieszkania jeśli są do niego przypisani lokatorzy"});
                } else {
                    let updates = {};
                    let userId = myApp.user.id();
                    if(userId) {
                        updates['/users/' + userId + '/flats/' + flat.id] = null;
                        updates['/flats/' + flat.id] = null;
                    }
                    return firebase.database().ref().update(updates, function (error) {
                        if (error) {
                            console.log(error)
                        } else {
                            myNavigator.pushPage('html/flat/flat_list.html')
                        }
                    });
                }
            }
        });
    }
};