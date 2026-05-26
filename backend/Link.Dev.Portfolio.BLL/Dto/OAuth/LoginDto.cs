using System;
using System.Collections.Generic;
using System.Text;

namespace Link.Dev.Profolie.BLL.Dto.OAuth
{
    public class LoginDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public bool RememberMe { get; set; }
    }
}
