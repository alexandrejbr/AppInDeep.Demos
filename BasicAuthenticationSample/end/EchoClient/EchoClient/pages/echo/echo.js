// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/echo/echo.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            document.getElementById("bt_echoviaget").addEventListener("click", this.echoGet);
            document.getElementById("bt_echoviapost").addEventListener("click", this.echoPost);
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        },
        echoGet: function () {
            var echoStr = document.getElementById("echoParam").value;

            var echoBaseUri = "http://echoappindeep.cloudapp.net/api/echo";

            var uri = echoBaseUri + "?echoStr=" + echoStr;

            WinJS.xhr({type: "GET", url: uri})
                .then(function complete(xhr) {
                    if (xhr.status == 200) {
                        var resultDiv = document.getElementById("result");
                        resultDiv.appendChild(resultDiv.ownerDocument.createTextNode(xhr.responseText));
                    }
                },
                function error(xhr) {
                    var resultDiv = document.getElementById("result");
                    resultDiv.appendChild(resultDiv.ownerDocument.createTextNode(String(xhr.status)));
                });
        },
        echoPost: function () {
            var echoStr = document.getElementById("echoParam").value;
            
            var uri = "http://echoappindeep.cloudapp.net/api/echo";

            var headers = {};
            headers["Content-Type"] = "application/x-www-form-urlencoded";

            WinJS.xhr({ type: "POST", url: uri, headers: headers, data: "=" + echoStr })
                .then(function complete(xhr) {
                    if (xhr.status == 200) {
                        var resultDiv = document.getElementById("result");
                        resultDiv.appendChild(resultDiv.ownerDocument.createTextNode(xhr.responseText));
                    }
                },
                function error(xhr) {
                    var resultDiv = document.getElementById("result");
                    resultDiv.appendChild(resultDiv.ownerDocument.createTextNode(String(xhr.status)));
                });
        }
    });
})();
