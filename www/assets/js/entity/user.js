/***********************************************************************************
 * App User
 ***********************************************************************************/

myApp.user = {

    id: function () {
        return firebase.auth().currentUser.uid;
    },

    current: function () {
        let id = this.id();
        return firebase.database().ref('/users/' + id);
    },

    get: function (id) {
        return firebase.database().ref('/users/' + id);
    },

    getByEmail: function (email) {
        return firebase.database().ref('/users/').orderByChild('email').equalTo(email).limitToFirst(1);
    },

    role: function () {
        let id = this.id();
        return firebase.database().ref('/users/' + id + '/role');
    },

    isLandlord: function (role) {
        return role === 'LANDLORD';
    },

    isTenant: function (role) {
        return role === 'TENANT';
    },

    splitter: function () {
        this.role().once('value').then(function (role) {
            if (myApp.user.isLandlord(role.val())) {
                myNavigator.pushPage('landlordSplitter.html');
            }
            myNavigator.pushPage('landlordSplitter.html');
        });
    },

    flats: function () {
        let id = this.id();
        return firebase.database().ref('/users/' + id + '/flats');
    },

    create: function (data) {
        let id = this.id();
        return firebase.database().ref('/users/' + id).set(data);
    },

    addToFlat: function (data) {
        let id = this.id();
        return firebase.database().ref('/users/' + id).set(data);
    }
};