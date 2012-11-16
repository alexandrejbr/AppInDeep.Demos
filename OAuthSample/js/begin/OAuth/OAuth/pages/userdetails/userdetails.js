// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/userdetails/userdetails.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            document.getElementById("startdance").addEventListener("click", this.startDance);
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        },
        startDance: function () {
            var authorizationEndpoint = ""; //Put the Authorization endpoint here
            var tokenEndpoint = ""; //Put the Token endpoint here
            
            var redirect_uri = ""; //Put the redirect uri that you registered for your client (App)

            var response_type = "code"; //for the authorization code flow this is the expected response_type

            var scope = ""; //List of permissions that your client (App) intents to have

            var state = ""; //Client provided value that the Authorization Server MUST return if provided

            var client_id = ""; // Put your client id here

            var client_secret = ""; //Put your client secret here

            var params = {};
            params.redirect_uri = redirect_uri;
            params.response_type = response_type;
            params.scope = scope;
            params.state = state;
            params.client_id = client_id;

            var allowedParams = ["response_type", "client_id", "redirect_uri", "scope", "state"];

            var startUri = new Windows.Foundation.Uri(wwwFormUrlEncode(authorizationEndpoint, params, allowedParams));

            var endUri = new Windows.Foundation.Uri(redirect_uri);

            Windows.Security.Authentication.Web.WebAuthenticationBroker.authenticateAsync(
                Windows.Security.Authentication.Web.WebAuthenticationOptions.none, startUri, endUri)
                    .then(function complete(res) {
                        
                    });
        }
    });
})();

function wwwFormUrlEncode(baseUri, params, allowedParams) {
    var buffer = [];
    if (baseUri) {
        buffer.push(baseUri);
        buffer.push("?");
    }

    for (var i = 0; i < allowedParams.length; ++i) {
        var curr = allowedParams[i];
        if ((curr in params) && params[curr]) {
            if (i != 0)
                buffer.push("&");
            buffer.push(curr);
            buffer.push("=");
            buffer.push(params[curr]);
        }
    }
    return buffer.join("");
}


