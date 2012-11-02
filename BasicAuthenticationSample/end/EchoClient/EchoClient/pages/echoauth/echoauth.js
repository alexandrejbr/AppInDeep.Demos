// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/echoauth/echoauth.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            document.getElementById("bt_echoviaget").addEventListener("click", this.echoGet);
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        },
        echoGet: function () {
            var username = document.getElementById("usernameParam").value;
            var password = document.getElementById("passwordParam").value;

            var uri = "http://echoappindeep.cloudapp.net/api/echoauth";

            var authValue = btoa(username + ":" + password);

            var headers = {Authorization: "Basic " + authValue};

            WinJS.xhr({ type: "GET", url: uri, headers: headers }).then(function complete(xhr) {
                var result = document.getElementById("result");
                result.appendChild(result.ownerDocument.createTextNode(xhr.responseText));
            });

            /*
                other version, IE Engine does a first request without authorization header. In presence of the 401, 
                it's issued another request with basic authentication using the provided username and password
            */

            //WinJS.xhr({ type: "GET", url: uri, user: username, password: password })

        }
    });
})();
