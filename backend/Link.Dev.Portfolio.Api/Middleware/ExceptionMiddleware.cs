using Link.Dev.E_Commerce.BLL.Services.ErrorException;
using Link.Dev.Profolie.BLL.ErrorException;
using System.Net;
using System.Text.Json;

namespace Link.Dev.Profolie.Api.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next   = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            HttpStatusCode statusCode;
            string message;

            switch (exception)
            {
                case NotFoundException e:
                    statusCode = HttpStatusCode.NotFound;
                    message = e.Message;
                    break;
                case BadRequestException e:
                    statusCode = HttpStatusCode.BadRequest;
                    message = e.Message;
                    break;
                case UnauthorizedAccessException e:
                    statusCode = HttpStatusCode.Unauthorized;
                    message = e.Message;
                    break;
                default:
                    statusCode = HttpStatusCode.InternalServerError;
                    message = "An unexpected error occurred.";
                    break;
            }

            context.Response.StatusCode = (int)statusCode;

            var response = new
            {
                statusCode = context.Response.StatusCode,
                message
            };

            var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            await context.Response.WriteAsync(json);
        }
    }
}
