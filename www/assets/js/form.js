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

        if(form.hasClass('edit-flat')) {
            let media = ['gas', 'water', 'wastes', 'power'];

            data['config'] = {};

            $.each(media, function (key, value) {

                if (data['config.' + value]) {
                    let mediaValue = data['config.' + value + '.value'] ? data['config.' + value + '.value'] : 0.0;
                    data['config'][value] = {
                        'type': data['config.' + value + '.type'],
                        'value': mediaValue
                    }
                }
                delete data['config.' + value];
                delete data['config.' + value + '.type'];
                delete data['config.' + value + '.value'];
            });
        }

        return data;
    }
};