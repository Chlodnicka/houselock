window.ajax = {

    options: {
        method: 'POST',
        domain: 'http://houselock.local',
        data: '',
        onSuccess: function () {
            ons.notification.alert('Sukces!');
        },
        onFail: function () {
            ons.notification.alert('Błąd połączenia. Spróbuj jeszcze raz.');
        }
    },

    setForm: function (form) {
        var formObject = $(form);

        this.options.method = formObject.attr('method') ? formObject.attr('method') : this.options.method;
        this.options.url = this.options.domain + formObject.attr('data-ajax');

        if (formObject.attr('id') != 'login') {
            this.options.beforeSend = function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
            }
        }

        this.options.data = this.serializeData(formObject);
    },

    serializeData: function (form) {
        var inputs = form.find('ons-input, ons-select, ons-checkbox, ons-radio');
        var data = [];
        $.each(inputs, function () {
            var input = $(this);
            data.push('_' + input.attr('id') + '=' + input.val());
        });
        return data.join('&');
    },

    sendForm: function (page, onSuccess, onFail) {
        this.setForm(page.querySelector('form'));
        $.ajax(this.options)
            .done(function (response) {
                onSuccess ? onSuccess(response, page) : this.onSuccess();
            })
            .fail(function (response) {
                onFail ? onFail(response) : this.onFail();
            })
            .always(function () {

            });
    },

    send: function (method, action, data, onSuccess, onFail) {
        $.ajax({
            method: method,
            url: this.options.domain + action,
            data: data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
            }
        }).done(function (response) {
            onSuccess(response);
        }).fail(function (response) {
            onFail(response);
        });
    }

};