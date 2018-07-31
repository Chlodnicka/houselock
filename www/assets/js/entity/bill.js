/***********************************************************************************
 * App Bill
 ***********************************************************************************/

myApp.bill = {

    last: function () {
        let flatId = localStorage.getItem('currentFlat');
        if (flatId) {
            return firebase.database().ref('/flats/' + flatId + '/bills').orderByChild('date').limitToLast(1)
        }
    },

    get: function (id) {
        return firebase.database().ref('/bills/' + id);
    },

    list: function (id = null) {
        let flatId = id ? id : localStorage.getItem('currentFlat');
        if (flatId) {
            return firebase.database().ref('/flats/' + flatId + '/bills').orderByChild('date');
        }
    }
};