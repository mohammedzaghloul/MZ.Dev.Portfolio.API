using Link.Dev.Profolie.DAL.Data;
using Link.Dev.Profolie.DAL.Model;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Link.Dev.Profolie.Api.ExMethod
{
    public static class IdentityServices
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services
            ,IConfiguration configuration)
        {

            //    Identity        
            services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                // Enforce unique emails to prevent duplicate-account login errors
                options.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

            //   JWT Authentication          
            var jwtSecret = configuration["Jwt:Secret"] ?? "321444444dewwwwwwwwwwwwwwwwwwwwwwwwwwwqrtret0534676rewtrt545$%$66542542256ewtyt";
            var jwtIssuer = configuration["Jwt:ValidIssuer"] ?? "LinkDevPortfolioApi";
            var jwtAudience = configuration["Jwt:ValidAudience"] ?? "LinkDevPortfolioClient";

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtIssuer,
                    ValidAudience = jwtAudience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
                    ClockSkew = TimeSpan.Zero
                };
            });

            services.AddAuthorization();
            return services;

        }
    }
}
