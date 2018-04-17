/***********************************************************************************
 * App Services. This contains the logic of the application organised in modules/objects. *
 ***********************************************************************************/

myApp.services = {

    token: {
        get: function () {
            if (localStorage.getItem('token')) {
                myApp.services.token.check();
            } else {
                myApp.services.common.clearAll();
            }
        },
        check: function () {
            ajax.send('get', '/api/flats', function (response) {
                console.log(response)
            }, function (response) {
                console.log(response)
            })
        }
    },

    common: {
        clearAll: function () {
            localStorage.clear();
            myNavigator.pushPage('html/auth/login.html');
        }
    },

    /////////////////////
    // User Service //
    ////////////////////
    user: {
        authorizeSuccess: function (response, page) {
            var form = page.querySelector('form');
            myApp.user.set(form.querySelector('#username').value, form.querySelector('#password').value);
            myApp.user.setToken(response.token);
            myApp.services.token.get();
            myNavigator.pushPage('splitter.html');
        },

        authorizeFail: function () {
            console.log('porażka!');
        },

        getInfo: function () {

        },

        // Update user
        update: function (user, data) {

        },


        // Add user to flat
        add: function (flat, data) {

        },

        //Remove user from flat
        remove: function (flat, user) {

        }

    },

    /////////////////
    // Flat Service //
    /////////////////
    flat: {

        // Creates a new flat
        create: function (data) {

        },

        // Modifies the inner data and current view of an existing flat.
        update: function (flat, data) {

        },

        // Deletes a flat
        remove: function (taskItem) {

        }
    },

    /////////////////////
    // Bill Service //
    ////////////////////
    bill: {

        // Update bill
        update: function (bill, data) {

        },


        // Pay bill
        pay: function (bill) {

        },

        //Mark bill as paid
        markAsPaid: function (bill) {

        }

    },


    ////////////////////////
    // Initial Data Service //
    ////////////////////////
    fixtures: [
        {
            title: 'Download OnsenUI',
            category: 'Programming',
            description: 'Some description.',
            highlight: false,
            urgent: false
        },
        {
            title: 'Install Monaca CLI',
            category: 'Programming',
            description: 'Some description.',
            highlight: false,
            urgent: false
        },
        {
            title: 'Star Onsen UI repo on Github',
            category: 'Super important',
            description: 'Some description.',
            highlight: false,
            urgent: false
        },
        {
            title: 'Register in the community forum',
            category: 'Super important',
            description: 'Some description.',
            highlight: false,
            urgent: false
        },
        {
            title: 'Send donations to Fran and Andreas',
            category: 'Super important',
            description: 'Some description.',
            highlight: false,
            urgent: false
        },
        {
            title: 'Profit',
            category: '',
            description: 'Some description.',
            highlight: false,
            urgent: false
        },
        {
            title: 'Visit Japan',
            category: 'Travels',
            description: 'Some description.',
            highlight: false,
            urgent: false
        },
        {
            title: 'Enjoy an Onsen with Onsen UI team',
            category: 'Personal',
            description: 'Some description.',
            highlight: false,
            urgent: false
        }
    ]
};
