#region Using
using Link.Dev.Profolie.BLL.AutoMapper;
using Link.Dev.Profolie.BLL.interfaces;
using Link.Dev.Profolie.BLL.interfaces.Upload;
using Link.Dev.Profolie.BLL.Services;
using Link.Dev.Profolie.BLL.Services.Upload;
using Link.Dev.Profolie.DAL.Data;
using Link.Dev.Profolie.DAL.Model;
using Link.Dev.Profolie.DAL.Repository;
using Link.Dev.Profolie.DAL.UnitOfWorks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System.Text; 
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
#endregion

namespace Link.Dev.Profolie.Api.ExMethod
{
    public static class CollectionServices
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
           
            //  Database 
           services.AddDbContext<ApplicationDbContext>(db =>
           {
                db.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
           });



            //  CORS 
          services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                    policy.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod());
            });
            //   AutoMapper   
            services.AddAutoMapper(a => a.AddProfile(new MappingAutoMapper()));

            //   Repositories & Unit of Work     
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

            //   Business Services          
            services.AddScoped<IAccountServices, AccountServicse>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IProjectServices, ProjectServices>();
            services.AddScoped<IContactService, ContactService>();
            services.AddScoped<ISkillService, SkillService>();
            services.AddScoped<IProjectSkillService, ProjectSkillService>();
            services.AddScoped<IUserProfileService, UserProfileService>();
            services.AddScoped<IExperienceService, ExperienceService>();

            //   Attachment (File Upload)       
            services.AddScoped<IAttachmentService, AttachmentService>();

            //   Rate Limiting   
            services.AddRateLimiter(options =>
            {
                // Auth Policy: IP-based partition, max 5 requests per 1 minute
                options.AddPolicy("AuthPolicy", context =>
                    RateLimitPartition.GetFixedWindowLimiter(
                        partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? context.Request.Headers.Host.ToString(),
                        factory: partition => new FixedWindowRateLimiterOptions
                        {
                            PermitLimit = 5,
                            Window = TimeSpan.FromMinutes(1),
                            QueueLimit = 0,
                            QueueProcessingOrder = QueueProcessingOrder.OldestFirst
                        }));

                // Upload Policy: IP-based partition, max 3 requests per 1 minute
                options.AddPolicy("UploadPolicy", context =>
                    RateLimitPartition.GetFixedWindowLimiter(
                        partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? context.Request.Headers.Host.ToString(),
                        factory: partition => new FixedWindowRateLimiterOptions
                        {
                            PermitLimit = 3,
                            Window = TimeSpan.FromMinutes(1),
                            QueueLimit = 0,
                            QueueProcessingOrder = QueueProcessingOrder.OldestFirst
                        }));

                // Write/Modification Policy (Contacts, Skills, etc.): IP-based partition, max 10 requests per 1 minute
                options.AddPolicy("WritePolicy", context =>
                    RateLimitPartition.GetFixedWindowLimiter(
                        partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? context.Request.Headers.Host.ToString(),
                        factory: partition => new FixedWindowRateLimiterOptions
                        {
                            PermitLimit = 10,
                            Window = TimeSpan.FromMinutes(1),
                            QueueLimit = 0,
                            QueueProcessingOrder = QueueProcessingOrder.OldestFirst
                        }));

                // Customize response on Rate Limit Exceeded (429 Too Many Requests)
                options.OnRejected = async (context, token) =>
                {
                    context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                    context.HttpContext.Response.ContentType = "application/json";
                    await context.HttpContext.Response.WriteAsJsonAsync(new
                    {
                        message = "Too many requests. Please try again later.",
                        statusCode = 429
                    }, token);
                };
            });

         

          
            //   Controllers   
            services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
                    options.JsonSerializerOptions.WriteIndented     = true;
                });

            return services;
        }
    }
}
