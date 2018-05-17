/***********************************************************************************
 * App User
 ***********************************************************************************/

myApp.user = {

    email: function () {
        return localStorage.getItem('email');
    },

    password: function () {
        return localStorage.getItem('password');
    },

    role: function () {
        return localStorage.getItem('role');
    },

    set: function (email, password) {
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
    },

    get: function () {
        return {
            email: this.email(),
            password: this.password(),
            role: this.role()
        };
    },

    check: function () {
        return this.email() && this.password();
    },

    isLandlord: function () {
        return this.role() === 'ROLE_LANDLORD';
    },

    isTenant: function () {
        return this.role() === 'ROLE_TENANT';
    },

    userData: function () {
        return JSON.parse(localStorage.getItem('userData'));
    },

    data: function () {
        let data = JSON.parse(localStorage.getItem('userData')).data;
        return data.user_info;
    },

    flats: function () {
        let data = JSON.parse(localStorage.getItem('userData')).data;
        return data.user_flats;
    },

    alerts: function () {
        let data = JSON.parse(localStorage.getItem('userData')).data;
        return data.alerts;
    },

    currentFlat: function () {
        let id = localStorage.getItem('currentFlat');
        return myApp.user.flats()[id];
    },

    currentFlatId: function () {
        return localStorage.getItem('currentFlat');
    },

    lastMeter: function () {

    },

    splitter: function () {
        if (this.isLandlord()) {
            return 'landlordSplitter.html';
        } else {
            return 'tenantSplitter.html';
        }
    },

    hasInvitation: function () {
        let info = myApp.user.data();
        return info.status && info.status === 'TEMP' && Object.keys(myApp.user.flats()).length > 0;
    },

    status: function () {
        let info = myApp.user.data();
        return info.status;
    }


};