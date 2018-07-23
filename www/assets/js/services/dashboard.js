/***********************************************************************************
 * Dashboard Services
 ***********************************************************************************/

myApp.services.dashboard = {

    lastBill: function (page) {
        myApp.bill.last().once('value').then(function (billSnapshot) {
            if (billSnapshot.numChildren() === 0) {
                myApp.services.bill.emptyList(page);
            } else {
                billSnapshot.forEach(function (flatBill) {
                    let billId = flatBill.key;
                    myApp.bill.get(billId).once('value').then(function (bill) {
                        let billInfo = bill.val();
                        billInfo['id'] = billId;
                        myApp.services.bill.fill(page, billInfo);
                    });
                });
            }
        });
    }
};

