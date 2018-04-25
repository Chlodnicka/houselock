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

    setToken: function (token) {
        localStorage.setItem('token', token);
    },

    get: function () {
        return {
            email: this.email,
            password: this.password,
            role: this.role
        };
    },

    check: function () {
        return this.email() && this.password();
    },

    data: function () {
        let data = JSON.parse(localStorage.getItem('userData')).data;
        return data.user_info;
    },

    flats: function () {
        let data = JSON.parse(localStorage.getItem('userData')).data;
        return data.user_flats;
    },

    currentFlat: function () {
        let id = localStorage.getItem('currentFlat');
        return myApp.user.flats()[id];
    }


};