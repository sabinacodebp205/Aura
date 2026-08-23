using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using Aura.Application.Sevices.Implementations;
using Aura.Application.Sevices.Interfaces;

namespace Aura.Application.Extensions
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            // AutoMapper
            services.AddAutoMapper(Assembly.GetExecutingAssembly());

            // FluentValidation
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

            // Services
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IAppUserService, AppUserService>();

            // Digər servislər
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IReviewService, ReviewService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IOrderItemService, OrderItemService>();
            services.AddScoped<IAddressService, AddressService>();
            services.AddScoped<IFavoriteService, FavoriteService>();
            services.AddScoped<IChatService, ChatService>();
            services.AddScoped<IProductImageService, ProductImageService>();
            services.AddScoped<ICouponService, CouponService>();

            return services;
        }
    }
}
