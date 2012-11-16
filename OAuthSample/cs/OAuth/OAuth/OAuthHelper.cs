using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Windows.Data.Json;
using Windows.Security.Authentication.Web;

namespace OAuth
{
    public static class OAuthHelper
    {
        public static IDictionary<string, string> ExtractQueryStringParams(Uri uri)
        {
            string queryStr = uri.Query;

            IDictionary<string, string> elems = new Dictionary<string, string>();

            //remove the first char that is a'?'
            queryStr = queryStr.Substring(1);

            string[] nameValuePairs = queryStr.Split('&');

            foreach (string nameValuePair in nameValuePairs)
            {
                string[] splits = nameValuePair.Split('=');

                elems.Add(splits[0], splits[1]);
            }
            return elems;
        }

        public static IEnumerable<KeyValuePair<string, string>> WwwFormUrlEncode(
            string clientId, string clientSecret, string grantType, string code, string redirectUri)
        {
            yield return new KeyValuePair<string, string>("client_id", clientId);
            yield return new KeyValuePair<string, string>("client_secret", clientSecret);
            yield return new KeyValuePair<string, string>("grant_type", grantType);
            yield return new KeyValuePair<string, string>("code", code);
            yield return new KeyValuePair<string, string>("redirect_uri", redirectUri);
        }

        public async static Task<TokenEndpointResponse> GetAuthorization(string authorizationEndpoint, string tokenEndpoint, string 
            redirectUri, string responseType, string scope, string state, string clientId, string clientSecret)
        {
            Uri callbackUri = new Uri(redirectUri);

            Uri requestUri = new Uri(
                String.Format("{0}?response_type={1}&client_id={2}&redirect_uri={3}&scope={4}&state={5}",
                              authorizationEndpoint, responseType, clientId, redirectUri, scope, state));

            //Open Web View and wait for user to authenticate and authorize your application
            WebAuthenticationResult webAuthenticationResult =
                await WebAuthenticationBroker.AuthenticateAsync(
                    WebAuthenticationOptions.None, requestUri, callbackUri);

            if (webAuthenticationResult.ResponseStatus == WebAuthenticationStatus.Success)
            {
                string responseData = webAuthenticationResult.ResponseData;

                Uri uri = new Uri(responseData);

                IDictionary<string, string> values = ExtractQueryStringParams(uri);

                string code;
                values.TryGetValue("code", out code);

                //User denied, you have error and error_description in the query string. Check them if you want
                if (code == null)
                {
                    //Can throw an exception
                    return null;
                }

                HttpClient client = new HttpClient();

                HttpResponseMessage response =
                    await client.PostAsync(tokenEndpoint,
                        new FormUrlEncodedContent(
                            WwwFormUrlEncode(clientId, clientSecret, "authorization_code", code, redirectUri)));

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    string body = await response.Content.ReadAsStringAsync();

                    JsonObject obj = JsonObject.Parse(body);

                    /*
                     * {
                     *  "access_token":"",
                     *  "token_type":"Bearer",
                     *  "expires_in":"3600",
                     *  "refresh_token":"",
                     *  "scope":""
                     * }
                     */

                    return new TokenEndpointResponse
                        {
                            AccessToken = obj.GetNamedValue("access_token").GetString(),
                            TokenType = obj.GetNamedValue("token_type").GetString(),
                            ExpiresIn = obj.GetNamedValue("expires_in").GetNumber(),
                            AuthenticationToken = obj.GetNamedValue("authentication_token").GetString(),
                            Scope = obj.GetNamedValue("scope").GetString()
                        };
                }

            }
            else if (webAuthenticationResult.ResponseStatus == WebAuthenticationStatus.ErrorHttp)
            {
                //return
                //    "HTTP Error returned by AuthenticateAsync() : " + webAuthenticationResult.ResponseErrorDetail.ToString();
                return null;
            }
            //return
            //    "Error returned by AuthenticateAsync() : " + webAuthenticationResult.ResponseStatus.ToString();
            return null;
        }
    }
}
