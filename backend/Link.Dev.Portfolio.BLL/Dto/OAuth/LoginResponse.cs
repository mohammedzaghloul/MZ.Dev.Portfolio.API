using System;
using System.Collections.Generic;
using System.Text;

namespace Link.Dev.Profolie.BLL.Dto.OAuth
{
    public class LoginResponse: Response
    {
        public string Token { get; set; } 
        public DateTime Expiration { get; set; }
    }
}
