/***********************************************************************************
 * App Bill
 ***********************************************************************************/

myApp.bill = {

    last: function () {
       let flatId = localStorage.getItem('currentFlat');
       if(flatId) {
           return firebase.database().ref('/flats/' + flatId + '/bills').orderByChild('date').limitToLast(1)
       }
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