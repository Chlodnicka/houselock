/////////////////
// Flat Service //
/////////////////
myApp.services.flat = {
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

    emptyFlatLandlord: function (page) {
        let info = ons.createElement('<div>Wybierz lub dodaj mieszkanie.</div>');
        page.querySelector('.content').appendChild(info);
        myApp.services.flat.list(page);
    },
    create: function (page) {
        ajax.sendForm(page, myApp.services.flat.onCreatedSuccess(), myApp.services.flat.onCreateFail());
    },


    onCreatedSuccess: function () {
        myNavigator.pushPage('html/flat/flat_info.html');
    },

    onCreateFail: function () {
        ons.notification.alert('Nie udalo sie dodac mieszkania!');
    },

    // Modifies the inner data and current view of an existing flat.
    update: function (flat, data) {

    },

    // Deletes a flat
    remove: function (taskItem) {

    }
};