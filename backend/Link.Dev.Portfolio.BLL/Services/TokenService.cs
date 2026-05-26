using Link.Dev.Profolie.BLL.Dto.OAuth;
using Link.Dev.Profolie.BLL.Helper;
using Link.Dev.Profolie.BLL.interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Link.Dev.Profolie.BLL.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;
        private readonly SymmetricSecurityKey _key;

        public TokenService(IConfiguration config)
        {
            _config = config;
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Secret"] 
                ?? "321444444dewwwwwwwwwwwwwwwwwwwwwwwwwwwqrtret0534676rewtrt545$%$66542542256ewtyt"));
        }

        public ResponseToken CreateToken(CreateTokenFormate createTokenFormate)
        {
            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, createTokenFormate.userId),
        new Claim(ClaimTypes.Email, createTokenFormate.email),
        new Claim(ClaimTypes.Role, createTokenFormate.role),
        new Claim(ClaimTypes.Name, createTokenFormate.Name)
    };

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            var issuer = _config["Jwt:ValidIssuer"] ?? _config["Jwt:Issuer"] ?? "";
            var audience = _config["Jwt:ValidAudience"] ?? _config["Jwt:Audience"] ?? "";

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7), // Set expiration explicitly
                SigningCredentials = creds,
                Issuer = issuer,
                Audience = audience,
                TokenType = "JWT",
                IncludeKeyIdInHeader = true
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            var tokens = tokenHandler.WriteToken(token);
            return new ResponseToken
            {
                Token = tokens,
                Expiration = tokenDescriptor.Expires ?? DateTime.UtcNow,
            };
        }

    }
}