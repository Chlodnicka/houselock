/////////////////
// Flat Service //
/////////////////
myApp.services.flat = {
    list: function(page, flats) {
        for (let id in flats) {
            let flat = flats[id];
            myApp.services.flat.item(page, flat);
        }
    },

    emptyList: function(page) {
        let info = ons.createElement('<div>Brak dodanych mieszkań - użyj przycisku by dodać mieszkanie.</div>');
        page.querySelector('.content').appendChild(info);
    },

    item: function(page, flat) {
        let name = flat.name ? flat.name : flat.street + ' ' + flat.building_number + ', ' + flat.city;
        let flatItem = ons.createElement(
            '<div>' +
            '<ons-list-item modifier="chevron" tappable>' + name + '</ons-list-item>' +
            '</div>'
        );


        flatItem.querySelector('.center').onclick = function() {
            // myNavigator.pushPage(myApp.user.splitter() + 'Splitter.html',
            //     {
            //         animation: 'lift',
            //         data: {
            //             element: flat
            //         }
            //     });
            myApp.services.common.setCurrentFlat(flat.id);
        };

        page.querySelector('.content').insertBefore(flatItem);
    },

    addAction: function(page) {
        let createFlat = ons.createElement(
            '<ons-fab class="fab-colors" position="bottom right" component="button/new-flat">' +
            '<ons-icon icon="md-plus"></ons-icon>' +
            '</ons-fab>'
        );

        createFlat.onclick = function() {
            document.querySelector('#myNavigator').pushPage('html/flat/flat_new.html');
        };

        page.querySelector('.content').appendChild(createFlat);
    },

    emptyFlatLandlord: function(page) {
        let info = ons.createElement('<div>Wybierz lub dodaj mieszkanie.</div>');
        page.querySelector('.content').appendChild(info);
        myApp.services.flat.list(page);
    },
    create: function(page) {
        ajax.sendForm(page, myApp.services.flat.onCreatedSuccess(), myApp.services.flat.onCreateFail());
    },


    onCreatedSuccess: function() {
        let data = JSON.stringify(response);
        localStorage.setItem('userData', data);
        let highest = response.data.user_flats[Object.keys(response.data.user_flats).sort().pop()].id;
        myApp.services.common.setCurrentFlat(highest);
    },

    onCreateFail: function() {
        ons.notification.alert({ message: 'Nie udało się dodać mieszkania!' });
    },

    displayActions: function(page, info) {

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

        Array.prototype.forEach.call(page.querySelectorAll('[component="button/flat-edit"]'), function(element) {
            element.onclick = function() {
                element.style.display = 'none';
                page.querySelector('[component="button/save"]').style.display = 'block';
                page.querySelector('[component="button/cancel"]').style.display = 'block';
                page.querySelector('div.flat_config_info').style.display = 'none';
                Array.prototype.forEach.call(page.querySelectorAll('form ons-list-item'), function(listitem) {
                    listitem.style.display = ' none';
                });
                Array.prototype.forEach.call(page.querySelectorAll('form .edit'), function(edititem) {
                    edititem.style.display = 'block';
                });
            };
        });
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/flat-remove"]'), function(element) {
            element.onclick = function() {
                myApp.services.flat.remove(info);
            };
        });
    },

    update: function(page, info) {
        ajax.sendForm(page, myApp.services.flat.updatedSuccess, myApp.services.flat.updatedFailed);
    },

    updatedSuccess: function(response) {
        myApp.services.common.updateFlat(response);
    },

    updatedFailed: function() {

    },

    remove: function(flat) {
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
        }).then(function(index) {
            if (index === 0) {
                ajax.send('post', '/api/flat/' + flat.id + '/delete', {}, myApp.services.common.updateInfoAfter);
            }
        });
    }
};