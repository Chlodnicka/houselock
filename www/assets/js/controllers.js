/***********************************************************************
 * App Controllers. These controllers will be called on page initialization. *
 ***********************************************************************/

myApp.controllers = {
    //////////////////////////
    // Loader Page Controller //
    //////////////////////////
    loaderPage: function (page) {
        // if (myApp.user.check()) {
            myNavigator.pushPage('splitter.html');
        // } else {
        //     myNavigator.pushPage('html/auth/login.html');
        // }
    },

    loginPage: function (page) {

    },
    //////////////////////////
    // Tabbar Page Controller //
    //////////////////////////
    tabbarPage: function (page) {
        // Set button functionality to open/close the menu.
        page.querySelector('[component="button/menu"]').onclick = function () {
            document.querySelector('#mySplitter').left.toggle();
        };

        // Set button functionality to push 'new_flat.html' page.
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/new-flat"]'), function (element) {
            element.onclick = function () {
                document.querySelector('#myNavigator').pushPage('html/flat/flat_new.html');
            };
            element.show && element.show(); // Fix ons-fab in Safari.
        });

        // Change tabbar animation depending on platform.
        page.querySelector('#myTabbar').setAttribute('animation', ons.platform.isAndroid() ? 'slide' : 'none');
    },

    ////////////////////////
    // Menu Page Controller //
    ////////////////////////
    menuPage: function (page) {
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/menu-item"]'), function (element) {
            element.onclick = function () {
                document.querySelector('#myNavigator').pushPage('html/' + element.getAttribute('data-url'));
            };
            element.show && element.show(); // Fix ons-fab in Safari.
        });
        // Change splitter animation depending on platform.
        document.querySelector('#mySplitter').left.setAttribute('animation', ons.platform.isAndroid() ? 'overlay' : 'reveal');
    },

    ////////////////////////////
    // New Flat Page Controller //
    ////////////////////////////
    newFlatPage: function (page) {
        // Set button functionality to save a new flat.
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/save-flat"]'), function (element) {
            element.onclick = function () {
                var newTitle = page.querySelector('#name-input').value;

                if (newTitle) {
                    // If input title is not empty, create a new task.
                    myApp.services.tasks.create(
                        {
                            title: newTitle,
                            category: page.querySelector('#category-input').value,
                            description: page.querySelector('#description-input').value,
                            highlight: page.querySelector('#highlight-input').checked,
                            urgent: page.querySelector('#urgent-input').checked
                        }
                    );

                    // Set selected category to 'All', refresh and pop page.
                    document.querySelector('#settings-list ons-list-item ons-radio').checked = true;
                    document.querySelector('#settings-list ons-list-item').updateCategoryView();
                    document.querySelector('#myNavigator').popPage();

                } else {
                    // Show alert if the input title is empty.
                    ons.notification.alert('You must provide a task title.');
                }
            };
        });
    },

    ////////////////////////////////
    // Details Task Page Controller //
    ///////////////////////////////
    flatPage: function (page) {
        // Get the element passed as argument to pushPage.
        var element = page.data.element;

        // Fill the view with the stored data.
        page.querySelector('#title-input').value = element.data.title;
        page.querySelector('#category-input').value = element.data.category;
        page.querySelector('#description-input').value = element.data.description;
        page.querySelector('#highlight-input').checked = element.data.highlight;
        page.querySelector('#urgent-input').checked = element.data.urgent;

        // Set button functionality to save an existing task.
        page.querySelector('[component="button/save-task"]').onclick = function () {
            var newTitle = page.querySelector('#title-input').value;

            if (newTitle) {
                // If input title is not empty, ask for confirmation before saving.
                ons.notification.confirm(
                    {
                        title: 'Save changes?',
                        message: 'Previous data will be overwritten.',
                        buttonLabels: ['Discard', 'Save']
                    }
                ).then(function (buttonIndex) {
                    if (buttonIndex === 1) {
                        // If 'Save' button was pressed, overwrite the task.
                        myApp.services.tasks.update(element,
                            {
                                title: newTitle,
                                category: page.querySelector('#category-input').value,
                                description: page.querySelector('#description-input').value,
                                ugent: element.data.urgent,
                                highlight: page.querySelector('#highlight-input').checked
                            }
                        );

                        // Set selected category to 'All', refresh and pop page.
                        document.querySelector('#settings-list ons-list-item ons-radio').checked = true;
                        document.querySelector('#settings-list ons-list-item').updateCategoryView();
                        document.querySelector('#myNavigator').popPage();
                    }
                });

            } else {
                // Show alert if the input title is empty.
                ons.notification.alert('You must provide a task title.');
            }
        };
    }
};
