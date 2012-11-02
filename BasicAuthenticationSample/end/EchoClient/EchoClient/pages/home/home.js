(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            document.getElementById("echo").addEventListener("click", function () {
                WinJS.Navigation.navigate("/pages/echo/echo.html");
            });

            document.getElementById("echowithauth").addEventListener("click", function() {
                WinJS.Navigation.navigate("/pages/echoauth/echoauth.html");
            });
        }
    });
})();
