using Aura.Application.DTOs.Coupon;
using Aura.Application.Sevices.Interfaces;
using Aura.Core.Entities;
using Aura.Core.Interfaces.Repositories;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Aura.Application.Sevices.Implementations
{
    public class CouponService : ICouponService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        // Default active campaign coupons supported out of the box
        private static readonly List<Coupon> DefaultCoupons = new()
        {
            new Coupon
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Code = "AURA15",
                DiscountPercent = 15m,
                IsActive = true,
                Description = "15% off luxury architectural streetwear",
                CreatedDate = DateTime.UtcNow
            },
            new Coupon
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Code = "AURA10",
                DiscountPercent = 10m,
                IsActive = true,
                Description = "10% off member exclusive discount",
                CreatedDate = DateTime.UtcNow
            },
            new Coupon
            {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Code = "WELCOME20",
                DiscountPercent = 20m,
                IsActive = true,
                Description = "20% welcome discount on first order",
                CreatedDate = DateTime.UtcNow
            }
        };

        public CouponService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<CouponValidationResultDto> ValidateCouponAsync(string code)
        {
            if (string.IsNullOrWhiteSpace(code))
            {
                return new CouponValidationResultDto
                {
                    IsValid = false,
                    Message = "Please provide a valid coupon code."
                };
            }

            var normalized = code.Trim().ToUpper();

            // Check database first
            var coupon = await _unitOfWork.CouponRepository.GetByCodeAsync(normalized);

            // Fallback to in-memory built-in default coupons
            if (coupon == null)
            {
                coupon = DefaultCoupons.FirstOrDefault(c => c.Code.ToUpper() == normalized);
            }

            if (coupon == null || !coupon.IsActive || coupon.IsDeleted)
            {
                return new CouponValidationResultDto
                {
                    IsValid = false,
                    Code = normalized,
                    Message = "Coupon is invalid or has been deactivated."
                };
            }

            if (coupon.ExpiryDate.HasValue && coupon.ExpiryDate.Value < DateTime.UtcNow)
            {
                return new CouponValidationResultDto
                {
                    IsValid = false,
                    Code = normalized,
                    Message = "Coupon has expired."
                };
            }

            return new CouponValidationResultDto
            {
                IsValid = true,
                Code = coupon.Code,
                DiscountPercent = coupon.DiscountPercent,
                MaxDiscountAmount = coupon.MaxDiscountAmount,
                Description = coupon.Description,
                Message = $"{coupon.DiscountPercent}% discount applied successfully!"
            };
        }

        public async Task<CouponDto?> GetActiveCampaignAsync()
        {
            var dbCoupons = await _unitOfWork.CouponRepository.GetAllAsync();
            var active = dbCoupons?.FirstOrDefault(c => c.IsActive && !c.IsDeleted && (!c.ExpiryDate.HasValue || c.ExpiryDate.Value > DateTime.UtcNow));

            if (active != null)
            {
                return _mapper.Map<CouponDto>(active);
            }

            var defaultActive = DefaultCoupons.First(c => c.Code == "AURA15");
            return new CouponDto
            {
                Id = defaultActive.Id,
                Code = defaultActive.Code,
                DiscountPercent = defaultActive.DiscountPercent,
                IsActive = defaultActive.IsActive,
                Description = defaultActive.Description
            };
        }

        public async Task<ICollection<CouponDto>> GetAllAsync()
        {
            var dbCoupons = await _unitOfWork.CouponRepository.GetAllAsync();
            if (dbCoupons != null && dbCoupons.Count > 0)
            {
                return _mapper.Map<ICollection<CouponDto>>(dbCoupons);
            }

            return DefaultCoupons.Select(c => new CouponDto
            {
                Id = c.Id,
                Code = c.Code,
                DiscountPercent = c.DiscountPercent,
                IsActive = c.IsActive,
                Description = c.Description
            }).ToList();
        }
    }
}
