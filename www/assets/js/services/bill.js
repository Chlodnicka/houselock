/////////////////////
// Bill Service //
////////////////////
myApp.services.bill = {

    create: function () {
        myApp.flat.current().once('value').then(function (flatSnapshot) {
            let flat = flatSnapshot.val();
            let now = new Date();
            let bill = myApp.services.bill.count(now, flat, {});
            let updates = {};
            let billKey = firebase.database().ref().child('bills').push().key;
            updates['/bills/' + billKey] = bill;
            updates['/flats/' + myApp.flat.id() + '/bills/' + billKey] = {date: now.getFullYear() + '_' + now.getMonth()};
            return firebase.database().ref().update(updates, function (error) {
                if (error) {
                    console.log(error)
                } else {
                    myNavigator.pushPage('landlordSplitter.html');
                }
            });
        })
    },

    count: function (now, flat, bill) {
        let sum = 0;
        let details = {};
        if (flat.config) {
            $.each(flat.config, function (key, value) {
                if (value.type === 'STATIC') {
                    sum += details[key] = parseFloat(value.value);
                } else if (value.type === 'METER') {
                    let billValue = bill[key] ? bill[key] : '0.00';
                    sum += details[key] = parseFloat(billValue) * parseFloat(value.value);
                } else if (value.type === 'BILL' && bill[key]) {
                    sum += details[key] = parseFloat(bill[key]);
                }
            });
        }
        sum += parseFloat(flat.mercenary);
        return {
            sum: sum,
            details: details,
            date: now.getFullYear() + '_' + now.getMonth(),
            status: 'NEW'
        };
    },

    list: function (page) {
        myApp.bill.list().once('value').then(function (flatBills) {
            if (flatBills.numChildren() === 0) {
                myApp.services.bill.emptyList(page);
            } else {
                flatBills.forEach(function (flatBill) {
                    let billId = flatBill.key;
                    myApp.bill.get(billId).once('value').then(function (bill) {
                        myApp.services.bill.item(page, billId, bill.val());
                    });
                });
            }
        }).catch(function (error) {
            console.log(error);
        });
    },

    emptyList: function (page) {
        let info = ons.createElement('<div>Brak rachunków dla mieszkania.</div>');
        page.querySelector('.content').appendChild(info);
    },

    item: function (page, id, bill) {
        let billDate = bill.date.split('_');
        let date = myApp.services.common.parseMonth(billDate[1]) + ' ' + billDate[0],
            name = date + ' - ' + bill.sum + ' - ' + myApp.services.common.parsePaymentStatus(bill.status);

        let billItem = ons.createElement(
            '<div>' +
            '<ons-list-item modifier="chevron" tappable>' + name + '</ons-list-item>' +
            '</div>'
        );

        bill['id'] = id;

        billItem.querySelector('.center').onclick = function () {
            myNavigator.pushPage('html/bill/bill_info.html',
                {
                    animation: 'lift',
                    data: {
                        element: bill
                    }
                });
        };

        $(page).find('.content').prepend(billItem);
    },

    fill: function (page, info) {
        let billDate = info.date.split('_');
        let month = myApp.services.common.parseMonth(billDate[1]);

        if (page.getAttribute('id') !== 'dashboardPage') {
            let date = month + ' ' + billDate[0];

            page.querySelector('.bill_name').appendChild(document.createTextNode(date));
        }

        myApp.flat.current().once('value').then(function (flatSnapshot) {
            let flat = flatSnapshot.val();
            let payDay = flat.pay_day + ' ' + month + ' ' + billDate[0];

            let sum = parseFloat(info.sum).toFixed(2);

            if (myApp.user.isTenant()) {
                let countTenant = Object.keys(myApp.flat.tenants()).length;
                sum = parseFloat(sum / countTenant).toFixed(2) + ' zł (Pełna wartość: ' + sum + ')';
            } else {
                sum += ' zł';
            }

            let billMainInfo = ons.createElement(
                '<div>' +
                '<ons-list-item>' +
                '<div class="left">Do kiedy płatny:</div>' +
                '<div class="right" id="">' + payDay + '</div>' +
                '</ons-list-item>' +
                '<div>' +
                '<ons-list-item>' +
                '<div class="left">Do zapłaty:</div>' +
                '<div class="right" id="">' + sum + '</div>' +
                '</ons-list-item>' +
                '</div>'
            );
            page.querySelector('form').appendChild(billMainInfo);

            myApp.services.bill.fillConfig(page, info, flat.config);

            let saveBtn = ons.createElement('<ons-button class="btn btn-danger" style="display:none;" component="button/save">Zapisz</ons-button>');

            saveBtn.onclick = function () {
                myApp.services.bill.update(page)
            };

            let cancelBtn = ons.createElement('<ons-button class="btn btn-secondary cancel-btn" style="display:none;" component="button/cancel">Anuluj</ons-button>');

            let form = page.querySelector('form');
            form.appendChild(saveBtn);
            form.appendChild(cancelBtn);

            myApp.services.common.cancel(page);

            myApp.user.role().once('value').then(function (roleSnapshot) {
                let role = roleSnapshot.val();
                if (myApp.user.isLandlord(role)) {
                    if (info.status === 'NEW' || info.status === 'UNPAID') {
                        let edit = ons.createElement(
                            '<ons-button component="button/edit">Edytuj rachunek</ons-button>'
                        );

                        page.querySelector('form').appendChild(edit);

                        myApp.services.common.edit(page);
                    }

                    if (info.status === 'NEW' || info.status === 'PARTIALLY PAID') {

                        let markAsPaid = ons.createElement(
                            '<ons-button component="button/mark-as-paid">Oznacz jako opłacony</ons-button>'
                        );

                        markAsPaid.onclick = function () {
                            myApp.services.bill.markAsPaid(info.id);
                        };

                        page.querySelector('.content').appendChild(markAsPaid);

                    }

                    if (info.status === 'UNPAID') {
                        let resendAlert = ons.createElement(
                            '<ons-button component="button/resend-alert">Przypomnij o płatności</ons-button>'
                        );

                        resendAlert.onclick = function () {
                            myApp.services.bill.resendAlert(info.id);
                        };

                        page.querySelector('.content').appendChild(resendAlert);
                    }
                } else {
                    if (myApp.flat.userBill() && myApp.flat.userBill().status !== 'PAID') {
                        let pay = ons.createElement(
                            '<ons-button component="button/pay">Zapłać</ons-button>'
                        );

                        pay.onclick = function () {
                            myApp.services.bill.pay(info.id);
                        };

                        page.querySelector('.content').appendChild(pay);
                    }
                }
            });
        });
    },

    fillConfig: function (page, info, config) {
        if (info.details.gas) {
            myApp.services.bill.fillConfigElement(page, info, config.gas.type, 'Gaz', 'gas');
        }

        if (info.details.power !== undefined) {
            myApp.services.bill.fillConfigElement(page, info, config.power.type, 'Prąd', 'power');
        }

        if (info.details.water !== undefined) {
            myApp.services.bill.fillConfigElement(page, info, config.water.type, 'Woda', 'water');
        }

        if (info.details.waste_water !== undefined) {
            myApp.services.bill.fillConfigElement(page, info, config.waste_water.type, 'Ścieki', 'waste_water');
        }

        if (info.details.rent !== undefined) {
            myApp.services.bill.fillConfigElement(page, info, config.rent.type, 'Czynsz', 'rent');
        }

        if (info.details.tv !== undefined) {
            myApp.services.bill.fillConfigElement(page, info, config.tv.type, 'Telewizja', 'tv');
        }

        if (info.details.internet !== undefined) {
            myApp.services.bill.fillConfigElement(page, info, config.internet.type, 'Internet', 'internet');
        }
    },

    fillConfigElement: function (page, info, config, name, index) {
        let configMessage = myApp.services.common.parseConfig(config);
        let edit = configMessage ?
            myApp.services.bill.configEdit(name, index, info.details[index], configMessage, config)
            : '';

        bill = ons.createElement(
            '<div>' +
            '<ons-list-item>' +
            '<div class="left">' + name + ':</div>' +
            '<div class="right" id="">' + parseFloat(info.details[index]).toFixed(2) + '</div>' +
            '</ons-list-item>' +
            edit +
            '</div>'
        );

        page.querySelector('form').appendChild(bill);
    },

    configEdit: function (name, index, value, configMessage, config) {
        let edit = '<div class="edit" style="display: none;">' +
            '<ons-input name="name" modifier="underbar" id="' + index + '_price" placeholder="' + configMessage + '" value="';

        // if (config === 'metric') {
        //     // edit += parseFloat(myApp.flat.meter()[index + '_meter']).toFixed(2);
        // } else {
            edit += parseFloat(value).toFixed(2);
        // }

        edit += '" float class="edit hidden">';
        edit += '</ons-input></div>';
        return edit;
    },

    // Update bill
    update: function (page) {
        ajax.sendForm(page, myApp.services.common.updateFlat);
    },


    // Pay bill
    pay: function (id) {
        ajax.send('post', '/api/bill/pay/' + id, {}, myApp.services.common.updateFlat)
    },

    //Mark bill as paid
    markAsPaid: function (id) {
        ajax.send('post', '/api/bill/' + id + '/markAsPaid', {}, myApp.services.common.updateFlat);
    },

    resendAlert: function (id) {
        ajax.send('post', '/api/bill/reminder/' + id, {})
    }
};