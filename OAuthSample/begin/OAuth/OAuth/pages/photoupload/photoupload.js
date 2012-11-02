// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/photoupload/photoupload.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            document.getElementById("pickphoto").addEventListener("click", this.upload);
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        },
        upload: function () {
            //Deal with snaped state
            var currentState = Windows.UI.ViewManagement.ApplicationView.value;
            if (currentState === Windows.UI.ViewManagement.ApplicationViewState.snapped &&
                !Windows.UI.ViewManagement.ApplicationView.tryUnsnap()) {
                // Fail silently if we can't unsnap
                return;
            }

            // Create the picker object and set options
            var openPicker = new Windows.Storage.Pickers.FileOpenPicker();
            openPicker.viewMode = Windows.Storage.Pickers.PickerViewMode.thumbnail;
            openPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.picturesLibrary;
            // Users expect to have a filtered view of their folders depending on the scenario.
            // For example, when choosing a documents folder, restrict the filetypes to documents for your application.
            openPicker.fileTypeFilter.replaceAll([".png", ".jpg", ".jpeg"]);

            // Open the picker for the user to pick a file
            openPicker.pickSingleFileAsync().then(function (file) {
                if (file) {

                }
                else {
                    // The picker was dismissed with no selected file
                }
            });
        }
    });
})();


