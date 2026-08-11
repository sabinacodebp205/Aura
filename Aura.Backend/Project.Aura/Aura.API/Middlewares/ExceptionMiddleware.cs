using System.Net;
using System.Text.Json;
using Aura.Core.Exceptions;

namespace Aura.API.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
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
                _logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            var statusCode = exception switch
            {
                BadRequestException => (int)HttpStatusCode.BadRequest,      // 400
                UnauthorizedException => (int)HttpStatusCode.Unauthorized,  // 401
                ForbiddenException => (int)HttpStatusCode.Forbidden,        // 403
                NotFoundException => (int)HttpStatusCode.NotFound,          // 404
                ConflictException => (int)HttpStatusCode.Conflict,          // 409
                _ => (int)HttpStatusCode.InternalServerError                // 500
            };

            context.Response.StatusCode = statusCode;

            var responseMessage = statusCode == (int)HttpStatusCode.InternalServerError
                ? "An error occurred while processing your request."
                : exception.Message;

            var response = new
            {
                message = responseMessage
            };

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(response, options));
        }
    }
}
