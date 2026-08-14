using Aura.API.Services;
using Aura.Application.Common;
using Aura.Application.Extensions;
using Aura.Application.Sevices.Interfaces;
using Aura.Core.Entities;
using Aura.Database.Contexts;
using Aura.Database.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Mvc;

namespace Aura.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Controllers & FluentValidation
            builder.Services.AddControllers();
            builder.Services.AddFluentValidationAutoValidation();
            builder.Services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = actionContext =>
                {
                    var errors = actionContext.ModelState
                        .Where(e => e.Value != null && e.Value.Errors.Count > 0)
                        .ToDictionary(
                            kvp => kvp.Key,
                            kvp => kvp.Value!.Errors.Select(e => e.ErrorMessage).ToArray()
                        );

                    var firstError = errors.Values.FirstOrDefault()?.FirstOrDefault() ?? "Validation failed.";

                    var responseBody = new
                    {
                        message = firstError,
                        errors = errors
                    };

                    return new BadRequestObjectResult(responseBody);
                };
            });

            // Application
            builder.Services.AddApplication();
            const string FrontendCorsPolicy = "FrontendCorsPolicy";

            builder.Services.AddCors(options =>
            {
                options.AddPolicy(FrontendCorsPolicy, policy =>
                {
                    policy.WithOrigins(
                    "http://localhost:5173",
                    "http://127.0.0.1:5173",
                    "http://localhost:5174",
                    "http://127.0.0.1:5174")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
                });
            });
            builder.Services.AddScoped<IFileUploadService, FileUploadService>();

            // Database
            builder.Services.AddDatabase(builder.Configuration);

            // Jwt Settings
            builder.Services.Configure<JwtSettings>(
                builder.Configuration.GetSection("JwtSettings"));

            // JWT Authentication
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,

                    ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
                    ValidAudience = builder.Configuration["JwtSettings:Audience"],

                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"]!))
                };
            });

            // Authorization
            builder.Services.AddAuthorization();

            // Swagger
            builder.Services.AddEndpointsApiExplorer();
          

            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Aura API",
                    Version = "v1"
                });

                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Bearer {token}"
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
            });

            var app = builder.Build();

            // Self-healing runtime guard for uploads directories
            var uploadsPath = Path.Combine(app.Environment.ContentRootPath, "wwwroot", "uploads", "products");
            if (!Directory.Exists(uploadsPath))
                Directory.CreateDirectory(uploadsPath);

            var designsUploadPath = Path.Combine(app.Environment.ContentRootPath, "wwwroot", "uploads", "designs");
            if (!Directory.Exists(designsUploadPath))
                Directory.CreateDirectory(designsUploadPath);

            app.UseSwagger();
            app.UseSwaggerUI();

            if (!app.Environment.IsDevelopment())
            {
                app.UseHttpsRedirection();
            }
            app.UseStaticFiles();

            app.UseCors(FrontendCorsPolicy);
            app.UseMiddleware<Aura.API.Middlewares.ExceptionMiddleware>();

            app.UseAuthentication();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
