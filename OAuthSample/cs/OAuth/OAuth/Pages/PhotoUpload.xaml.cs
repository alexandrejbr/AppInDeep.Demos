using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.Networking.BackgroundTransfer;
using Windows.Storage;
using Windows.Storage.Pickers;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The Basic Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=234237

namespace OAuth.Pages
{
    /// <summary>
    /// A basic page that provides characteristics common to most applications.
    /// </summary>
    public sealed partial class PhotoUpload : OAuth.Common.LayoutAwarePage
    {
        public PhotoUpload()
        {
            this.InitializeComponent();
        }

        /// <summary>
        /// Populates the page with content passed during navigation.  Any saved state is also
        /// provided when recreating a page from a prior session.
        /// </summary>
        /// <param name="navigationParameter">The parameter value passed to
        /// <see cref="Frame.Navigate(Type, Object)"/> when this page was initially requested.
        /// </param>
        /// <param name="pageState">A dictionary of state preserved by this page during an earlier
        /// session.  This will be null the first time a page is visited.</param>
        protected override void LoadState(Object navigationParameter, Dictionary<String, Object> pageState)
        {
        }

        /// <summary>
        /// Preserves state associated with this page in case the application is suspended or the
        /// page is discarded from the navigation cache.  Values must conform to the serialization
        /// requirements of <see cref="SuspensionManager.SessionState"/>.
        /// </summary>
        /// <param name="pageState">An empty dictionary to be populated with serializable state.</param>
        protected override void SaveState(Dictionary<String, Object> pageState)
        {
        }

        private async void Button_Click_1(object sender, RoutedEventArgs e)
        {
            FileOpenPicker openPicker = new FileOpenPicker
            {
                ViewMode = PickerViewMode.Thumbnail,
                SuggestedStartLocation = PickerLocationId.PicturesLibrary
            };
            openPicker.FileTypeFilter.Add(".jpg");
            openPicker.FileTypeFilter.Add(".jpeg");
            openPicker.FileTypeFilter.Add(".png");
            StorageFile file = await openPicker.PickSingleFileAsync();
            if (file != null)
            {
                const string authorizationEndpoint =
                    "https://login.live.com/oauth20_authorize.srf";//Put the Authorization endpoint here

                const string tokenEndpoint = "https://login.live.com/oauth20_token.srf";//Put the Token endpoint here

                const string redirectUri = "";//Put the redirect uri that you registered for your client (App)

                const string responseType = "code";//for the authorization code flow this is the expected response_type

                const string scope = "wl.skydrive_update";//List of permissions that your client (App) intents to have

                const string state = "";//Client provided value that the Authorization Server MUST return if provided (for security purposes)

                const string clientId = "";//Put your client id here

                const string clientSecret = "";//Put your client secret here

                TokenEndpointResponse tokenEndpointResponse =
                    await OAuthHelper.GetAuthorization(authorizationEndpoint, tokenEndpoint, redirectUri,
                        responseType, scope, state, clientId, clientSecret);

                if (tokenEndpointResponse == null)
                {
                    this.tblock_danceResult.Text = "Error or user refused to authorize";
                    return;
                }

                BackgroundUploader uploader = new BackgroundUploader();

                uploader.Method = "PUT";
                uploader.SetRequestHeader("Authorization", 
                    tokenEndpointResponse.TokenType + " " + tokenEndpointResponse.AccessToken);

                Uri protectedResourceUri = new Uri("https://apis.live.net/v5.0/me/skydrive/files/" + file.Name);

                UploadOperation uploadOperation = uploader.CreateUpload(protectedResourceUri, file);

                await uploadOperation.StartAsync();

                this.tblock_danceResult.Text = "SUCCESS";

            }
            else
            {
                //picker dismissed
            }


            //HttpClient client = new HttpClient();

            //client.DefaultRequestHeaders.Authorization =
            //    new AuthenticationHeaderValue(tokenEndpointResponse.TokenType, tokenEndpointResponse.AccessToken);

            //string protectedResourceUri = "https://apis.live.net/v5.0/me/skydrive/files/";

            //HttpResponseMessage getUserDetailsResponse =
            //    await
            //        client.GetAsync(new Uri(protectedResourceUri));

            //string getUserDetailsResponseBody = await getUserDetailsResponse.Content.ReadAsStringAsync();

            //this.tblock_danceResult.Text = getUserDetailsResponseBody;
        }
    }
}
