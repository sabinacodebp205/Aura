using Aura.Application.DTOs.Address;
using Aura.Application.DTOs.AppUser;
using Aura.Application.DTOs.Auth;
using Aura.Application.DTOs.Category;
using Aura.Application.DTOs.Favorite;
using Aura.Application.DTOs.Order;
using Aura.Application.DTOs.OrderItem;
using Aura.Application.DTOs.Product;
using Aura.Application.DTOs.ProductImage;
using Aura.Application.DTOs.Review;
using Aura.Core.Entities;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public static string BaseUrl { get; set; } = "http://localhost:5083";

        public static string ToAbsoluteUrl(string? url)
        {
            if (string.IsNullOrWhiteSpace(url)) return string.Empty;
            if (url.StartsWith("http://", StringComparison.OrdinalIgnoreCase) ||
                url.StartsWith("https://", StringComparison.OrdinalIgnoreCase) ||
                url.StartsWith("data:", StringComparison.OrdinalIgnoreCase))
            {
                return url;
            }

            var baseUri = (BaseUrl ?? "http://localhost:5083").TrimEnd('/');
            var relative = url.StartsWith('/') ? url : $"/{url}";
            return $"{baseUri}{relative}";
        }

        public MappingProfile()
        {
            // Product
            CreateMap<Product, ProductCreateDto>().ReverseMap();

            CreateMap<Product, ProductUpdateDto>().ReverseMap();

            CreateMap<Product, ProductGetDto>()
                .ForMember(dest => dest.CategoryName,
                    opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null))
                .ForMember(dest => dest.ImageUrls,
                    opt => opt.MapFrom(src => src.Images != null 
                        ? src.Images.OrderByDescending(i => i.IsMain).ThenBy(i => i.CreatedDate).Select(i => ToAbsoluteUrl(i.ImageUrl)).ToList() 
                        : new List<string>()))
                .ReverseMap();

            CreateMap<Product, ProductDetailsDto>()
                .ForMember(dest => dest.CategoryName,
                    opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null))
                .ForMember(dest => dest.ImageUrls,
                    opt => opt.MapFrom(src => src.Images != null 
                        ? src.Images.OrderByDescending(i => i.IsMain).ThenBy(i => i.CreatedDate).Select(i => ToAbsoluteUrl(i.ImageUrl)).ToList() 
                        : new List<string>()))
                .ForMember(dest => dest.ReviewCount,
                    opt => opt.MapFrom(src => src.Reviews != null ? src.Reviews.Count : 0))
                .ForMember(dest => dest.AverageRating,
                    opt => opt.MapFrom(src =>
                        (src.Reviews != null && src.Reviews.Any())
                            ? src.Reviews.Average(r => r.Rating)
                            : 0))
                .ReverseMap();


            // Category
            CreateMap<Category, CategoryGetDto>().ReverseMap();
            CreateMap<Category, CategoryCreateDto>().ReverseMap();
            CreateMap<Category, CategoryUpdateDto>().ReverseMap();

            // Review
            CreateMap<Review, ReviewCreateDto>().ReverseMap();
            CreateMap<Review, ReviewUpdateDto>().ReverseMap();
            CreateMap<Review, ReviewGetDto>()
                .ForMember(dest => dest.UserName,
                    opt => opt.MapFrom(src => src.User != null ? src.User.UserName : null));

            // Address
            CreateMap<Address, AddressGetDto>().ReverseMap();
            CreateMap<Address, AddressCreateDto>().ReverseMap();
            CreateMap<Address, AddressUpdateDto>().ReverseMap();

            // Favorite
            CreateMap<Favorite, FavoriteCreateDto>().ReverseMap();
            CreateMap<Favorite, FavoriteGetDto>()
                .ForMember(dest => dest.ProductName,
                    opt => opt.MapFrom(src => src.Product != null ? src.Product.Name : null))
                .ForMember(dest => dest.Price,
                    opt => opt.MapFrom(src => src.Product != null ? src.Product.Price : 0))
                .ForMember(dest => dest.ImageUrl,
                    opt => opt.MapFrom(src =>
                        (src.Product != null && src.Product.Images != null)
                            ? ToAbsoluteUrl(src.Product.Images.FirstOrDefault(i => i.IsMain) != null
                                ? src.Product.Images.FirstOrDefault(i => i.IsMain)!.ImageUrl
                                : src.Product.Images.Select(i => i.ImageUrl).FirstOrDefault())
                            : string.Empty));

            // Order
            CreateMap<Order, OrderCreateDto>().ReverseMap();
            CreateMap<Order, OrderUpdateDto>().ReverseMap();
            CreateMap<Order, OrderStatusUpdateDto>().ReverseMap();
            CreateMap<Order, OrderGetDto>().ReverseMap();

            // OrderItem
            CreateMap<OrderItem, OrderItemCreateDto>().ReverseMap();
            CreateMap<OrderItem, OrderItemGetDto>()
                .ForMember(dest => dest.ProductName,
                    opt => opt.MapFrom(src => src.Product != null ? src.Product.Name : null))
                .ForMember(dest => dest.Price,
                    opt => opt.MapFrom(src => src.Product != null ? src.Product.Price : 0))
                .ForMember(dest => dest.ImageUrl,
                    opt => opt.MapFrom(src =>
                        (src.Product != null && src.Product.Images != null)
                            ? ToAbsoluteUrl(src.Product.Images.Where(i => i.IsMain).Select(i => i.ImageUrl).FirstOrDefault()
                                ?? src.Product.Images.Select(i => i.ImageUrl).FirstOrDefault())
                            : string.Empty));

            // ProductImage
            CreateMap<ProductImage, ProductImageGetDto>()
                .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => ToAbsoluteUrl(src.ImageUrl)))
                .ReverseMap();

            // AppUser
            CreateMap<AppUser, UserGetDto>().ReverseMap();
            CreateMap<AppUser, UpdateProfileDto>().ReverseMap();

            // Auth
            CreateMap<RegisterDto, AppUser>().ReverseMap();
        }
    }
}
