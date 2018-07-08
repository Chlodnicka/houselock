/***********************************************************************************
 * App Flat
 ***********************************************************************************/

myApp.flat = {

    id: function () {
        return localStorage.getItem('currentFlat');
    },

    get: function (id) {
        return firebase.database().ref('/flats/' + id);
    },

    current: function () {
        let id = localStorage.getItem('currentFlat');
        if (id) {
            return this.get(id);
        }
    },

    config: function () {
        let id = localStorage.getItem('currentFlat');
        if (id) {
            return firebase.database().ref('/flats/' + id + '/config');
        }
    },

    tenants: function () {
        let id = localStorage.getItem('currentFlat');
        if (id) {
            return firebase.database().ref('/flats/' + id + '/tenants');
        }
    },

    addTenant: function (userId, flatId, invitationId = null) {
        let updates = {};
        updates['/flats/' + flatId + '/tenants/' + userId] = true;
        updates['/users/' + userId + '/flat/'] = flatId;
        updates['/users/' + userId + '/role'] = 'TENANT';
        updates['/users/' + userId + '/status'] = 'WAITING';

        if (invitationId) {
            updates['/invitations/' + invitationId + '/status'] = 'SEEN';
        }
        return firebase.database().ref().update(updates, function (error) {
            if (error) {
                console.log(error)
            } else {
                if (invitationId) {
                    myApp.services.flat.setCurrent(flatId);
                    myNavigator.pushPage('html/user/user_accept_invitation.html');
                } else {
                    myApp.user.splitter();
                }
            }
        });
    }
};