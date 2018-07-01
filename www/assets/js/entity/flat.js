/***********************************************************************************
 * App Flat
 ***********************************************************************************/

myApp.flat = {

    get: function (id) {
        return firebase.database().ref('/flats/' + id);
    },

    current: function () {
      let id = localStorage.getItem('currentFlat');
      if(id) {
          return this.get(id);
      }
    },

    tenants: function () {
        let id = localStorage.getItem('currentFlat');
        if(id) {
            return firebase.database().ref('/flats/' + id + '/tenants');
        }
    }
};