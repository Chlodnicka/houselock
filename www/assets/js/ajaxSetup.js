window.form = {

    serialize: function (page) {
        let form = $(page.querySelector('form'));
        let inputs = form.find('ons-input, ons-select, ons-checkbox, ons-radio');
        let data = {};
        $.each(inputs, function () {
            let input = $(this);
            if (input.prop('localName') === 'ons-checkbox') {
                let actualInputDOM = input.children('input');
                data[input.attr('id')] = actualInputDOM.prop('checked');
            } else {
                data[input.attr('id')] = input.val();
            }
        });
        return data;
    }

};