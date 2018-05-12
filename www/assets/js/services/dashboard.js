/***********************************************************************************
 * Dashboard Services
 ***********************************************************************************/

myApp.services.dashboard = {

    noLastBill: function (page) {
        let info = ons.createElement('<div>Brak rachunków dla mieszkania.</div>');
        page.querySelector('.content').appendChild(info);
    },

};
