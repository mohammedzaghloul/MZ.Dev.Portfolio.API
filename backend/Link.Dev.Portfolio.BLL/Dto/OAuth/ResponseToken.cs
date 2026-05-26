using System;
using System.Collections.Generic;
using System.Text;

namespace Link.Dev.Profolie.BLL.Dto.OAuth
{
    public class ResponseToken
    {
        public string Token { get; set; } 
        public DateTime Expiration { get; set; }
    }
}
