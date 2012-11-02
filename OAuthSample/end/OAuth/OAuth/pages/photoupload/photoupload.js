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

                    var authorizationEndpoint = "https://login.live.com/oauth20_authorize.srf"; //Put the Authorization endpoint here
                    var tokenEndpoint = "https://login.live.com/oauth20_token.srf"; //Put the Token endpoint here

                    var redirect_uri = ""; //Put the redirect uri that you registered for your client (App)

                    var response_type = "code"; //for the authorization code flow this is the expected response_type

                    var scope = "wl.skydrive_update"; //List of permissions that your client (App) intents to have

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
                                var returnedUri = new Windows.Foundation.Uri(res.responseData);
                                var code = returnedUri.queryParsed.getFirstValueByName("code");

                                var requestBodyAllowedParams = ["client_id", "client_secret", "grant_type", "code", "redirect_uri"];
                                var requestBodyParams = {
                                    client_id: client_id,
                                    client_secret: client_secret,
                                    grant_type: "authorization_code",
                                    code: code,
                                    redirect_uri: redirect_uri
                                };
                                var requestBody = wwwFormUrlEncode(null, requestBodyParams, requestBodyAllowedParams);

                                var headers = {};
                                headers["Content-Type"] = "application/x-www-form-urlencoded";

                                return WinJS.xhr({ type: "POST", url: tokenEndpoint, headers: headers, data: requestBody });

                            },
                            function error(err) {

                            }
                        )
                        .then(function (xhr) {
                            var jsonObj = JSON.parse(xhr.responseText);

                            var protectedResourceUri = "https://apis.live.net/v5.0/me/skydrive/files/" + file.name;

                            var uri = new Windows.Foundation.Uri(protectedResourceUri);

                            var uploader = new Windows.Networking.BackgroundTransfer.BackgroundUploader();
                            uploader.method = "PUT";
                            uploader.setRequestHeader("Authorization", jsonObj.token_type + " " + jsonObj.access_token);

                            var upload = uploader.createUpload(uri, file);

                            return upload.startAsync();
                        })
                        .then(function (uploadOperation) {
                            var resultDiv = document.getElementById("result");
                            resultDiv.appendChild(resultDiv.ownerDocument.createTextNode("SUCCESS"));
                        });
                }
                else {
                    // The picker was dismissed with no selected file
                }
            });
        }
    });
})();


