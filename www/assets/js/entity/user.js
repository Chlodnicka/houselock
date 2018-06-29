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

    flats: function () {
        let id = this.id();
        return firebase.database().ref('/users/' + id + '/flats');
    }
};