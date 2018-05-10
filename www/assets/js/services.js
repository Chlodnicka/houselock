/***********************************************************************************
 * App Services. This contains the logic of the application organised in modules/objects. *
 ***********************************************************************************/

myApp.services = {

    common: {

        parseMonth: function (month) {
            switch (month) {
                case 'January':
                    return 'styczeń';
                    break;
                case 'February':
                    return 'luty';
                    break;
                case 'March':
                    return 'marzec';
                    break;
                case 'April':
                    return 'kwiecień';
                    break;
                case 'May':
                    return 'maj';
                    break;
                case 'June':
                    return 'czerwiec';
                    break;
                case 'July':
                    return 'lipiec';
                    break;
                case 'August':
                    return 'sierpień';
                    break;
                case 'September':
                    return 'wrzesień';
                    break;
                case 'October':
                    return 'październik';
                    break;
                case 'November':
                    return 'listopad';
                    break;
                case 'December':
                    return 'grudzień';
                    break;
                default:
                    return 'Błąd'
            }
        },

        parsePaymentStatus: function (status) {
            switch (status) {
                case 'NEW':
                    return 'nowy';
                    break;
                case 'PAID':
                    return 'opłacony';
                    break;
                case 'PARTIALLY PAID':
                    return 'częściowo opłacony';
                    break;
                case 'UNPAID':
                    return 'nieopłacony';
                    break;
                default:
                    return 'Błąd'
            }
        },

        parseConfig: function (config) {
            if (config === 'METER') {
                return 'Uzupełnij stan licznika';
            } else if (config === 'BILL') {
                return 'Uzupełnij kwotę rachunku'
            }
            return false;
        },

        parseAction: function (form, id) {
            let ajax = $(form).attr('data-ajax').replace('{id}', id);
            $(form).attr('data-ajax', ajax);
        },

        token: {
            get: function () {
                return localStorage.getItem('token');
            },

            set: function (token) {
                localStorage.setItem('token', token);
            },

            check: function () {
                ajax.send('get', '/api/check', '{}', myApp.services.user.getInfo, myApp.services.common.authorize);
            }
        },

        checkCredentials: function () {
            return myApp.user.email() && myApp.user.password();
        },

        authorize: function () {
            let data = '_username=' + myApp.user.email() + '&_password=' + myApp.user.password();
            ajax.send('post', '/api/login_check', data, myApp.services.common.setTokenAndGetInfo, myApp.services.common.redirectToLogin);
        },

        authorizeSuccess: function (response, page) {
            let form = page.querySelector('form');
            myApp.user.set(form.querySelector('#username').value, form.querySelector('#password').value);
            myApp.services.common.setTokenAndGetInfo(response);
        },

        authorizeFail: function () {
            ons.notification.alert({message: 'Nie udało się zalogować, spróbuj ponownie!'});
        },

        redirectToLogin: function () {
            myNavigator.pushPage('html/auth/login.html');
            sessionStorage.setItem('isLoggedIn', false);
            myApp.services.common.clearAll();
        },

        setTokenAndGetInfo: function (response) {
            myApp.services.common.token.set(response.token);
            ajax.send('get', '/api/check', '{}', myApp.services.user.getInfo, myApp.services.common.redirectToLogin);
        },

        edit: function (page) {
            Array.prototype.forEach.call(page.querySelectorAll('[component="button/edit"]'), function (element) {
                element.onclick = function () {
                    element.style.display = 'none';
                    page.querySelector('[component="button/save"]').style.display = 'block';
                    page.querySelector('[component="button/cancel"]').style.display = 'block';
                    Array.prototype.forEach.call(page.querySelectorAll('ons-list-item'), function (listitem) {
                        listitem.style.display = 'none';
                    });
                    Array.prototype.forEach.call(page.querySelectorAll('.edit'), function (edititem) {
                        edititem.style.display = 'block';
                    });
                };
            });
        },

        cancel: function (page) {
            Array.prototype.forEach.call(page.querySelectorAll('[component="button/cancel"]'), function (element) {
                element.onclick = function () {
                    element.style.display = 'none';
                    page.querySelector('[component="button/save"]').style.display = 'none';
                    page.querySelector('[component="button/edit"]').style.display = 'block';
                    Array.prototype.forEach.call(page.querySelectorAll('ons-list-item'), function (listitem) {
                        listitem.style.display = 'flex';
                    });
                    Array.prototype.forEach.call(page.querySelectorAll('.edit'), function (edititem) {
                        edititem.style.display = 'none';
                    });
                };
            });
        },

        save: function (page, onSuccess) {
            ajax.sendForm(page, onSuccess);
        },

        clearAll: function () {
            localStorage.clear();
            sessionStorage.clear();
        },

        setCurrentFlat: function (id) {
            localStorage.setItem('currentFlat', id);
            ajax.send('get', '/api/flat/' + id, '{}', myApp.services.common.updateFlat);
        },

        updateFlat: function (response) {
            let data = JSON.stringify(response);
            localStorage.setItem('flatData', data);
            myNavigator.pushPage(myApp.user.splitter());
        }
    },

    /////////////////////
    // User Service //
    ////////////////////
    user: {
        getInfo: function (response) {
            sessionStorage.setItem('isLoggedIn', true);
            localStorage.setItem('role', response.data[0]);
            ajax.send('get', '/api/all', '{}', myApp.services.user.setData, myApp.services.common.redirectToLogin);
        },

        setData: function (response) {
            localStorage.setItem('userData', JSON.stringify(response));
            if (myApp.user.isTenant()) {
                let flats = myApp.user.flats();
                let id = Object.keys(flats)[0];
                if (id) {
                    myApp.services.common.setCurrentFlat(id);
                }
            }
            myApp.services.user.setAppForUser();
        },

        setAppForUser: function () {
            if (myApp.user.isLandlord()) {
                if (myApp.user.flats()) {
                    if (myApp.user.currentFlat()) {
                        myNavigator.pushPage('landlordSplitter.html');
                    } else {
                        myNavigator.pushPage('html/flat/flat_info.html');
                    }
                } else {
                    myNavigator.pushPage('html/flat/flat_info.html');
                }
            } else if (myApp.user.isTenant()) {
                if (myApp.user.currentFlat()) {
                    myNavigator.pushPage('tenantSplitter.html');
                } else {
                    if (myApp.user.hasInvitation()) {
                        myNavigator.pushPage('html/user/user_accept_invitation.html');
                    } else {
                        myNavigator.pushPage('html/user/dashboard.html');
                    }
                }
            } else {
                myApp.services.common.clearAll();
                myApp.services.common.redirectToLogin();
            }
        },

        fill: function (page, data) {
            let card = page.querySelector('form'),
                userData = data ? data : myApp.user.data(),
                phone = userData.phone ? userData.phone : 'Telefon',
                account = userData.account_number ? userData.account_number : 'Numer konta bankowago';

            let userInfo = ons.createElement(
                '<div>' +
                '<ons-list-item class="fullname">' + userData.fullname + '</ons-list-item>' +
                '<div class="edit" style="display: none;">' +
                '<ons-input name="firstname" modifier="underbar" placeholder="Imię" value="' + userData.firstname + '" float class="edit hidden"> </ons-input>' +
                '<ons-input id="lastname" modifier="underbar" placeholder="Nazwisko" value="' + userData.lastname + '" float class="edit hidden""></ons-input>' +
                '</div>' +
                '<ons-list-item class="phone">' + phone + '</ons-list-item>' +
                '<div class="edit" style="display: none">' +
                '<ons-input name="phone" modifier="underbar" placeholder="Telefon" value="' + phone + '" float class="edit hidden"> </ons-input>' +
                '</div>' +
                '<ons-list-item class="account_number">' + account + '</ons-list-item>' +
                '<div class="edit" style="display: none">' +
                '<ons-input name="phone" modifier="underbar" placeholder="Numer konta bankowego" value="' + account + '" float class="edit hidden"> </ons-input>' +
                '</div>' +
                '<ons-button style="display:none;" modifier="large" component="button/save">Zapisz</ons-button>' +
                '</div>'
                )
            ;

            userInfo.querySelector('').onclick = function () {
                myApp.services.user.save(page.querySelector('form'))
            };

            card.appendChild(userInfo);

            myApp.services.common.edit(page);

        },

        save: function (form) {
            console.log(form);
        },

        list: function (page, users) {
            for (let id in users) {
                let user = users[id];
                myApp.services.user.item(page, user);
            }
        },

        emptyList: function (page) {
            let info = ons.createElement('<div>Brak lokatorów. Dodaj ich do mieszkania.</div>');
            page.querySelector('.content').appendChild(info);
        },

        item: function (page, user) {

            let name = user.lastname ? user.firstname + ' ' + user.lastname : user.email;

            let userItem = ons.createElement(
                '<div>' +
                '<ons-list-item modifier="chevron" tappable>' + name + '</ons-list-item>' +
                '</div>'
            );


            userItem.querySelector('.center').onclick = function () {
                myNavigator.pushPage('html/user/tenant_info.html',
                    {
                        animation: 'lift',
                        data: {
                            element: user
                        }
                    });
            };

            page.querySelector('.content').insertBefore(userItem);
        },

        // Add user to flat
        addSuccess: function (response) {
            console.log(response);
        },

    },

    /////////////////
    // Flat Service //
    /////////////////
    flat:
        {
            list: function (page, flats) {
                for (let id in flats) {
                    let flat = flats[id];
                    myApp.services.flat.item(page, flat);
                }
            },

            emptyList: function (page) {
                let info = ons.createElement('<div>Brak dodanych mieszkań - użyj przycisku by dodać mieszkanie.</div>');
                page.querySelector('.content').appendChild(info);
            },

            item: function (page, flat) {
                let name = flat.name ? flat.name : flat.street + ' ' + flat.building_number + ', ' + flat.city;
                let flatItem = ons.createElement(
                    '<div>' +
                    '<ons-list-item modifier="chevron" tappable>' + name + '</ons-list-item>' +
                    '</div>'
                );


                flatItem.querySelector('.center').onclick = function () {
                    // myNavigator.pushPage(myApp.user.splitter() + 'Splitter.html',
                    //     {
                    //         animation: 'lift',
                    //         data: {
                    //             element: flat
                    //         }
                    //     });
                    myApp.services.common.setCurrentFlat(flat.id);
                };

                page.querySelector('.content').insertBefore(flatItem);
            },

            emptyFlatLandlord: function (page) {
                let info = ons.createElement('<div>Wybierz lub dodaj mieszkanie.</div>');
                page.querySelector('.content').appendChild(info);
                myApp.services.flat.list(page);
            },

            // Creates a new flat
            create: function (data) {

            },

            // Modifies the inner data and current view of an existing flat.
            update: function (flat, data) {

            },

            // Deletes a flat
            remove: function (taskItem) {

            }
        }
    ,

    /////////////////////
    // Bill Service //
    ////////////////////
    bill: {
        list: function (page, bills) {
            for (let id in bills) {
                let bill = bills[id];
                myApp.services.bill.item(page, bill);
            }
        },

        emptyList: function (page) {
            let info = ons.createElement('<div>Brak rachunków dla mieszkania.</div>');
            page.querySelector('.content').appendChild(info);
        },

        item: function (page, bill) {
            let date = myApp.services.common.parseMonth(bill.month) + ' ' + bill.year,
                name = date + ' - ' + bill.sum + ' - ' + myApp.services.common.parsePaymentStatus(bill.payment_status);

            let billItem = ons.createElement(
                '<div>' +
                '<ons-list-item modifier="chevron" tappable>' + name + '</ons-list-item>' +
                '</div>'
            );


            billItem.querySelector('.center').onclick = function () {
                myNavigator.pushPage('html/bill/bill_info.html',
                    {
                        animation: 'lift',
                        data: {
                            element: bill
                        }
                    });
            };

            page.querySelector('.content').insertBefore(billItem);
        },

        fill: function (page, info) {

            let month = myApp.services.common.parseMonth(info.month);

            if (page.getAttribute('id') !== 'dashboardPage') {
                let date = month + ' ' + info.year;

                page.querySelector('.bill_name').appendChild(document.createTextNode(date));
            }

            let flat = myApp.user.currentFlat(),
                payDay = flat.pay_day + ' ' + month + ' ' + info.year;

            let billMainInfo = ons.createElement(
                '<div>' +
                '<ons-list-item>' +
                '<div class="left">Do kiedy płatny:</div>' +
                '<div class="right" id="">' + payDay + '</div>' +
                '</ons-list-item>' +
                '<div>' +
                '<ons-list-item>' +
                '<div class="left">Do zapłaty:</div>' +
                '<div class="right" id="">' + parseFloat(info.sum).toFixed(2) + ' zł</div>' +
                '</ons-list-item>' +
                '</div>'
            );
            page.querySelector('form').appendChild(billMainInfo);

            myApp.services.bill.fillConfig(page, info, flat.flat_config);

            let saveBtn = ons.createElement('<ons-button style="display:none;" component="button/save">Zapisz</ons-button>');

            saveBtn.onclick = function () {
                myApp.services.bill.update(page)
            };

            let cancelBtn = ons.createElement('<ons-button style="display:none;" component="button/cancel">Anuluj</ons-button>');

            cancelBtn.onclick = function () {
                myApp.services.common.cancel(page)
            };

            let form = page.querySelector('form');
            form.appendChild(saveBtn);
            form.appendChild(cancelBtn);

            myApp.services.common.parseAction(form, info.id);

            if (myApp.user.isLandlord()) {
                if (info.payment_status === 'NEW' || info.payment_status === 'PARTIALLY PAID') {
                    if (info.payment_status === 'NEW') {
                        let edit = ons.createElement(
                            '<ons-button component="button/edit">Edytuj rachunek</ons-button>'
                        );

                        page.querySelector('form').appendChild(edit);

                        myApp.services.common.edit(page);
                    }

                    let markAsPaid = ons.createElement(
                        '<ons-button component="button/mark-as-paid">Oznacz jako opłacony</ons-button>'
                    );
                    page.querySelector('.content').appendChild(markAsPaid);

                } else if (info.payment_status === 'UNPAID') {
                    let resendAlert = ons.createElement(
                        '<ons-button component="button/resend-alert">Przypomnij o płatności</ons-button>'
                    );
                    page.querySelector('.content').appendChild(resendAlert);
                }
            }

            if (myApp.user.isTenant()) {
                if (info.payment_status !== 'PAID') {
                    let pay = ons.createElement(
                        '<ons-button component="button/pay">Zapłać</ons-button>'
                    );
                    page.querySelector('.content').appendChild(pay);
                }
            }
        },

        fillConfig: function (page, info, config) {
            if (info.gas_price !== null) {
                myApp.services.bill.fillConfigElement(page, info, config.gas.config_type, 'Gaz', 'gas');
            }

            if (info.power_price !== null) {
                myApp.services.bill.fillConfigElement(page, info, config.power.config_type, 'Prąd', 'power');
            }

            if (info.water_price !== null) {
                myApp.services.bill.fillConfigElement(page, info, config.water.config_type, 'Woda', 'water');
            }

            if (info.waste_water_price !== null) {
                myApp.services.bill.fillConfigElement(page, info, config.waste_water.config_type, 'Ścieki', 'waste_water');
            }

            if (info.rent_price !== null) {
                myApp.services.bill.fillConfigElement(page, info, config.rent.config_type, 'Czynsz', 'rent');
            }

            if (info.tv_price !== null) {
                myApp.services.bill.fillConfigElement(page, info, config.tv.config_type, 'Telewizja', 'tv');
            }

            if (info.internet_price !== null) {
                myApp.services.bill.fillConfigElement(page, info, config.internet.config_type, 'Internet', 'internet');
            }
        },

        fillConfigElement: function (page, info, config, name, index) {
            let configMessage = myApp.services.common.parseConfig(config);
            let edit = configMessage ?
                myApp.services.bill.configEdit(name, index, info[index + '_price'], configMessage, config)
                : '';

            bill = ons.createElement(
                '<div>' +
                '<ons-list-item>' +
                '<div class="left">' + name + ':</div>' +
                '<div class="right" id="">' + parseFloat(info[index + '_price']).toFixed(2) + '</div>' +
                '</ons-list-item>' +
                edit +
                '</div>'
            );

            page.querySelector('form').appendChild(bill);
        },

        configEdit: function (name, index, value, configMessage, config) {
            let edit = '<div class="edit" style="display: none;">' +
                '<label for="' + index + '_price">' + name + ' (' + configMessage + ')</label>' +
                '<ons-input name="name" modifier="underbar" id="' + index + '_price" placeholder="' + configMessage + '" value="';

            if (config === 'METER') {
                edit += parseFloat(myApp.flat.meter()[index + '_meter']).toFixed(2);
            } else {
                edit += parseFloat(value).toFixed(2);
            }

            edit += '" float class="edit hidden">';
            edit += '</ons-input></div>';
            return edit;
        },

        // Update bill
        update: function (page) {
            ajax.sendForm(page, myApp.services.common.updateFlat);
        },


        // Pay bill
        pay: function (bill) {

        },

        //Mark bill as paid
        markAsPaid: function (bill) {

        }

    },

    dashboard: {
        noLastBill: function (page) {
            let info = ons.createElement('<div>Brak rachunków dla mieszkania.</div>');
            page.querySelector('.content').appendChild(info);
        }
    }

}
;
