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
            } else if (myApp.user.isTenant(role.val())) {
                myNavigator.pushPage('tenantSplitter.html');
            }
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

    setDeleted: function (userId) {
        let updates = {};
        this.role().once('value').then(function (role) {
            myApp.user.get(userId).once('value').then(function (userSnapshot) {
               let removedUser = userSnapshot.val();
               let flatId = removedUser.flat;
                if (myApp.user.isLandlord(role.val())) {
                    updates['/users/' + userId + '/status/'] = 'DELETED_BY_LANDLORD';
                    if(removedUser.status === 'DELETED_BY_SELF') {
                        updates['/users/' + userId + '/flat'] = null;
                        updates['/flats/' + flatId + '/tenants/' + userId] = null;
                    }
                } else {
                    updates['/users/' + userId + '/status/'] = 'DELETED_BY_SELF';
                    if(removedUser.status === 'DELETED_BY_LANDLORD' || removedUser.status === 'WAITING') {
                        updates['/users/' + userId + '/flat'] = null;
                        updates['/flats/' + flatId + '/tenants/' + userId] = null;
                    }
                }

                return firebase.database().ref().update(updates, function (error) {
                    if (error) {
                        console.log(error)
                    } else {
                        if (myApp.user.isTenant(role.val())) {
                            myNavigator.pushPage('html/user/user_no_flat.html');
                        } else {
                            myApp.user.splitter();
                        }
                    }
                });
            });
        });

    },

    invitation: function (email) {
        let data = {
            'flat' : myApp.flat.id(),
            'landlord' :  this.id(),
            'email' : email,
            'status' : 'NEW'
        };

        let invitationKey = firebase.database().ref().child('invitations').push().key;
        let updates = {};
        updates['/invitations/' + invitationKey] = data;
        return firebase.database().ref().update(updates, function (error) {
            if (error) {
                console.log(error)
            } else {
                myApp.user.splitter();
            }
        });
    }
};