/***********************************************************************************
 * Dashboard Services
 ***********************************************************************************/

myApp.services.dashboard = {

    noLastBill: function(page) {
        let info = ons.createElement('<div>Brak rachunków dla mieszkania.</div>');
        page.querySelector('.content').appendChild(info);
    },

    displayCurrentFlat: function(page, info) {


        let gasChecked = info.flat_config.gas ? ' checked ' : '';
        let powerChecked = info.flat_config.power ? ' checked ' : '';
        let waterChecked = info.flat_config.water ? ' checked ' : '';
        let wastesChecked = info.flat_config.waste_water ? ' checked ' : '';


        let gasPrice = '';
        if (gasChecked) {
            if (info.flat_config.gas.price_full) {
                gasPrice = info.flat_config.gas.price_full;
            } else if (info.flat_config.gas.price_meter) {
                gasPrice = info.flat_config.gas.price_meter;
            }
        }

        let powerPrice = '';
        if (powerChecked) {
            if (info.flat_config.power.price_full) {
                powerPrice = info.flat_config.power.price_full;
            } else if (info.flat_config.power.price_meter) {
                powerPrice = info.flat_config.power.price_meter;
            }
        }

        let waterPrice = '';
        if (waterChecked) {
            if (info.flat_config.water.price_full) {
                waterPrice = info.flat_config.water.price_full;
            } else if (info.flat_config.water.price_meter) {
                waterPrice = info.flat_config.water.price_meter;
            }
        }

        let wastesPrice = '';
        if (wastesChecked) {
            if (info.flat_config.waste_water.price_full) {
                wastesPrice = info.flat_config.waste_water.price_full;
            } else if (info.flat_config.waste_water.price_meter) {
                wastesPrice = info.flat_config.waste_water.price_meter;
            }
        }


        let flat = ons.createElement(
            '<form data-ajax="/api/flat/' + info.id + '" method="post" id="flat_info_save">' +
            '<div><ons-card><ons-list-header>' + info.name + '</ons-list-header>' +
            '<ons-list-item><div>Adres:  </div><div>ul. ' + info.street + ' ' + info.building_number + '/' + info.flat_number + '</div></ons-list-item>' +
            '<div class="edit" style="display: none">' +
            '<ons-input id="street" name="street" modifier="underbar" minLength="1" maxLength="50" placeholder="Ulica" value="' + info.street + '" float class="edit hidden"> </ons-input>' +
            '<ons-input id="building_number" name="building_number" min="1" max="1000" modifier="underbar" placeholder="Numer budynku" value="' + info.building_number + '" float class="edit hidden"> </ons-input>' +
            '<ons-input id="flat_number" name="flat_number" modifier="underbar" placeholder="Numer mieszkania" value="' + info.flat_number + '" float class="edit hidden"> </ons-input>' +
            '</div>' +
            '<ons-list-item>Miasto i kod pocztowy:  ' + info.city + ' ' + info.postal_code + '</ons-list-item>' +
            '<div class="edit" style="display: none">' +
            '<ons-input id="city" name="city" modifier="underbar" placeholder="Miasto" value="' + info.city + '" float class="edit hidden"> </ons-input>' +
            '<ons-input id="postal_code" name="postal_code" modifier="underbar" placeholder="Kod pocztowy" value="' + info.postal_code + '" float class="edit hidden"> </ons-input>' +
            '</div>' +
            '<ons-list-item>Kwota za wynajem:  ' + info.mercenary + ' PLN</ons-list-item>' +
            '<div class="edit" style="display: none">' +
            '<ons-input id="mercenary" name="mercenary" modifier="underbar" placeholder="Kwota za wynajem" value="' + info.mercenary + '" float class="edit hidden"> </ons-input>' +
            '</div>' +
            '<ons-list-item>Dzień płatności:  ' + info.pay_day + '</ons-list-item>' +
            '<div class="edit" style="display: none">' +
            '<ons-input id="pay_day" name="pay_day" modifier="underbar" placeholder="Dzien płatności" value="' + info.pay_day + '" float class="edit hidden"> </ons-input>' +
            '</div>' +
            '</ons-card>' +

            '<ons-card>' +
            '<div class="edit hidden" style="display: none">' +
            '<ons-list-header>Ustawienia mediów</ons-list-header>' +

            '<div class="edit hidden" style="display: none; margin-bottom: 30px;">' +
            '<div style="display:flex; margin: 20px 0;">' +
            '<label class="config-left" for="flat_gas_config">' +
            'Gaz: ' +
            '</label>' +
            '<ons-checkbox class="config-right" id="flat_gas_config" ' + gasChecked + ' name="flat_config" modifier="underbar" float class="edit hidden" value="gas_option"></ons-checkbox>' +
            '</div>' +
            '<div style="display:flex; margin: 20px 0;">' +
            '<label  class="config-left" for="gas_payment_option_bill">Sposób rozliczenia:</label>' +
            '<ons-select  style="margin-top: -7px;" class="config-right" id="gas_payment_option_bill" name="gas_payment_option_bill">' +
            myApp.services.common.selectOption(info.flat_config.gas) +
            '</ons-select>' +
            '</div>' +
            '<ons-input id="flat_gas_price" modifier="underbar" placeholder="Kwota" float class="edit hidden" value="' + gasPrice + '"></ons-input>' +
            '</div>' +

            '<div class="edit hidden" style="display: none; margin-bottom: 30px;">' +
            '<div style="display:flex; margin: 20px 0;">' +
            '<label class="config-left" for="flat_power_config">Prąd</label>' +
            '<ons-checkbox class="config-right" id="flat_power_config" ' + powerChecked + ' name="flat_config" modifier="underbar" float class="edit hidden" value="power_option"></ons-checkbox>' +
            '</div>' +
            '<div style="display:flex; margin: 20px 0;">' +
            '<label class="config-right" for="power_payment_option_bill">Sposób rozliczenia:</label>' +
            '<ons-select class="config-left" id="power_payment_option_bill" name="power_payment_option_bill">' +
            myApp.services.common.selectOption(info.flat_config.power) +
            '</ons-select>' +
            '</div>' +
            '<ons-input id="flat_power_price" modifier="underbar" placeholder="Kwota" float class="edit hidden" value="' + powerPrice + '"></ons-input>' +
            '</div>' +

            '<div class="edit hidden" style="display: none; margin-bottom: 30px;">' +
            '<div style="display:flex; margin: 20px 0;">' +
            '<label class="config-left" for="flat_wastes_config">Śmieci</label>' +
            '<ons-checkbox class="config-right" id="flat_wastes_config" ' + wastesChecked + ' name="flat_config" modifier="underbar" float class="edit hidden" value="wastes_option"></ons-checkbox>' +
            '</div>' +
            '<div style="display:flex; margin: 20px 0;">' +
            '<label class="config-left" for="wastes_payment_option_bill">Sposób rozliczenia:</label>' +
            '<ons-select class="config-right" id="wastes_payment_option_bill" name="wastes_payment_option_bill">' +
            myApp.services.common.selectOption(info.flat_config.waste_water) +
            '</ons-select>' +
            '</div>' +
            '<ons-input id="flat_wastes_price" modifier="underbar" placeholder="Kwota" float class="edit hidden" value="' + wastesPrice + '"></ons-input>' +
            '</div>' +

            '<div class="edit hidden" style="display: none; margin-bottom: 30px;">' +
            '<div style="display:flex; margin: 20px 0;">' +
            '<label class="config-left" for="flat-water-config">Woda</label>' +
            '<ons-checkbox class="config-right" id="flat_water_config" ' + waterChecked + ' name="flat_config" modifier="underbar" float class="edit hidden" value="water_option"></ons-checkbox>' +
            '</div>' +
            '<div style="display:flex; margin: 20px 0;">' +
            '<label class="config-left" for="water_payment_option_bill">Sposób rozliczenia:</label>' +
            '<ons-select class="config-right" id="water_payment_option_bill" name="water_payment_option_bill">' +
            myApp.services.common.selectOption(info.flat_config.water) +
            '</div>' +
            '<ons-input id="flat_water_price" modifier="underbar" placeholder="Kwota" float class="edit hidden" value="' + waterPrice + '"></ons-input>' +
            '</div>' +

            '<div id="flat_config_info">' +
            '<div id="gas_config">' +
            '<ons-list-header>Gaz</ons-list-header>' +
            '<ons-list-item>Sposób rozliczenia:' + +'</ons-list-item>' +
            '<ons-list-item>Kwota: ' + +'</ons-list-item></br>' +
            '</div>' +
            '<div id="power_config">' +
            '<ons-list-header>Prąd</ons-list-header>' +
            '<ons-list-item>Sposób rozliczenia:' + +'</ons-list-item>' +
            '<ons-list-item>Kwota: ' + +'</ons-list-item>' +
            '</div>' +
            '<div id="wastes_config">' +
            '<ons-list-header>Śmieci</ons-list-header>' +
            '<ons-list-item>Sposób rozliczenia:' + +'</ons-list-item>' +
            '<ons-list-item>Kwota: ' + +'</ons-list-item>' +
            '</div>' +
            '<div id="water_config">' +
            '<ons-list-header>Woda</ons-list-header>' +
            '<ons-list-item>Sposób rozliczenia:' + +'</ons-list-item>' +
            '<ons-list-item>Kwota: ' + +'</ons-list-item>' +
            '</div>' +
            '</div>' +

            '<ons-button style="display:none;" modifier="large" component="button/save">Zapisz</ons-button>' +
            '<ons-button class="cancel-btn" style="display:none;" modifier="large" component="button/cancel">Anuluj</ons-button>' +
            '</ons-card>' +
            '</div>' +
            '</form>'
        );
        page.querySelector('.content').appendChild(flat);

        page.querySelector('[component="button/save"]').onclick = function() {
            myApp.services.flat.update(page, info)
        };
        myApp.services.common.edit(page);
        myApp.services.common.cancel(page);
    },

};