using Link.Dev.Profolie.BLL.Dto.OAuth;
using Link.Dev.Profolie.BLL.Helper;

namespace Link.Dev.Profolie.BLL.interfaces
{
    public interface ITokenService
    {
     ResponseToken CreateToken(CreateTokenFormate createTokenFormate);
        
    }
}
