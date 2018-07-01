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
      if(id) {
          return this.get(id);
      }
    },

    config: function() {
        let id = localStorage.getItem('currentFlat');
        if(id) {
            return firebase.database().ref('/flats/' + id + '/config');
        }
    },

    tenants: function () {
        let id = localStorage.getItem('currentFlat');
        if(id) {
            return firebase.database().ref('/flats/' + id + '/tenants');
        }
    }
};