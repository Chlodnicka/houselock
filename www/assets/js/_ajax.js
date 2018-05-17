window.ajax = {

    options: {
        method: 'POST',
        domain: 'http://api.houselock.com.pl',
        data: '',
        onSuccess: function () {
            // ons.notification.alert('Sukces!');
        },
        onFail: function (response) {
            ons.notification.alert(response.responseJSON.data);
        }
    },

    setForm: function (form) {
        var formObject = $(form);

        this.options.method = formObject.attr('method') ? formObject.attr('method') : this.options.method;
        console.log(this.options.method);
        this.options.url = this.options.domain + formObject.attr('data-ajax');
        console.log(this.options.url);
        if (formObject.attr('id') != 'login') {
            this.options.beforeSend = function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
            }
        }

        this.options.data = this.serializeData(formObject);
        console.log(this.options.data);
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
        $('#loading').show();
        $.ajax(this.options)
            .done(function (response) {
                onSuccess ? onSuccess(response, page) : this.onSuccess();
            })
            .fail(function (response) {
                onFail ? onFail(response) : this.onFail(response);
            })
            .always(function () {
                $('#loading').hide();
            });
    },

    send: function (method, action, data, onSuccess, onFail) {
        $('#loading').show();
        options = this.options;
        $.ajax({
            method: method,
            url: options.domain + action,
            data: data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
            }
        }).done(function (response) {
            onSuccess ? onSuccess(response) : options.onSuccess();
        }).fail(function (response) {
            onFail ? onFail(response) : options.onFail(response);
        }).always(function () {
            $('#loading').hide();
        });
    }

};