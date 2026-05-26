using Microsoft.OpenApi;

namespace Link.Dev.Profolie.Api.ExMethod
{
    public static class SwaggerServices
    {
        public static IServiceCollection AddSwagerServices(this IServiceCollection services)
        {
            //   Swagger with Bearer Token support  
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Link.Dev Portfolio API",
                    Version = "v1"
                });

                var securityScheme = new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter your JWT token. Example: Bearer {your_token}"
                };

                c.AddSecurityDefinition("Bearer", securityScheme);

                c.AddSecurityRequirement((_) =>
                {
                    var securityRequirement = new OpenApiSecurityRequirement();
                    securityRequirement.Add(new OpenApiSecuritySchemeReference("Bearer"), new List<string>());
                    return securityRequirement;
                });
            });

            return services;
        }
    }
}
