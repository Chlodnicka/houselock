/***********************************************************************************
 * App Flat
 ***********************************************************************************/

myApp.flat = {

    currentFlat: function () {
        let id = localStorage.getItem('currentFlat');
        return myApp.user.flats()[id];
    },

    bills: function () {
        let info = JSON.parse(localStorage.getItem('flatData')).data;
        return info.bills;
    },

    bill: function () {
        let info = JSON.parse(localStorage.getItem('flatData')).data;
        return info.last_bill;
    },

    tenants: function () {
        let info = JSON.parse(localStorage.getItem('flatData')).data;
        return info.tenants;
    }

};