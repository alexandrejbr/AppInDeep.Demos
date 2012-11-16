using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OAuth
{
    public class TokenEndpointResponse
    {
        public string AccessToken { get; set; }
        public string TokenType { get; set; }
        public double ExpiresIn { get; set; }
        public string AuthenticationToken { get; set; }
        public string Scope { get; set; }
    }
}
