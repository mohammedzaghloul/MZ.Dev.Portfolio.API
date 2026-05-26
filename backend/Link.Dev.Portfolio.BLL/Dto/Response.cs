using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Link.Dev.Profolie.BLL.Dto
{
    public class Response
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = null!;
        public List<string> Errors { get; set; } = null!;
        public string Token { get; set; }
        public DateTime Expiration { get; set; }
        public IdentityResult Roles { get; set; }=new IdentityResult();
    }
}
