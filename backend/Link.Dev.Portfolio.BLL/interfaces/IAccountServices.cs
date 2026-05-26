using Link.Dev.Profolie.BLL.Dto;
using Link.Dev.Profolie.BLL.Dto.OAuth;
using System;
using System.Collections.Generic;
using System.Text;

namespace Link.Dev.Profolie.BLL.interfaces
{
    public interface IAccountServices 
    {
        Task<Response> LoginAsync(LoginDto dto);
       Task<Response> RegisiterAsync(RegisterDto dto);
        Task<bool> RegisterAdminAsync(RegisterDto dto);
        Task LogOut();
    }
}
