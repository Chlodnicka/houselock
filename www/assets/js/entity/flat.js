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
        if (info.bills) {
            return info.bills;
        }
        return {};
    },

    bill: function () {
        let info = JSON.parse(localStorage.getItem('flatData')).data;
        if (info.last_bill) {
            return info.last_bill;
        }
        return {};
    },

    tenants: function () {
        let info = JSON.parse(localStorage.getItem('flatData')).data;
        if (info.tenants) {
            return info.tenants;
        }
        return {};
    },

    meter: function () {
        let info = JSON.parse(localStorage.getItem('flatData')).data;
        if (info.last_meter) {
            return info.last_meter;
        }
        return {};
    },

    userBill: function () {
        let info = JSON.parse(localStorage.getItem('flatData')).data;
        if (info.user_bill) {
            return info.user_bill;
        }
        return {};
    },

    userBills: function () {
        let info = JSON.parse(localStorage.getItem('flatData')).data;
        if (info.user_bills) {
            return info.user_bills;
        }
        return {};
    }

};