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

    set: function (email, password) {
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
    },

    get: function () {
        return {
            email: this.email,
            password: this.password
        };
    },

    check: function () {
        return this.email() && this.password();
    }




};