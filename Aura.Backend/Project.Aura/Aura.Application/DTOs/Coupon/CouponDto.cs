using System;

namespace Aura.Application.DTOs.Coupon
{
    public class CouponDto
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = null!;
        public decimal DiscountPercent { get; set; }
        public decimal? MaxDiscountAmount { get; set; }
        public bool IsActive { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string? Description { get; set; }
    }

    public class CouponValidationResultDto
    {
        public bool IsValid { get; set; }
        public string Code { get; set; } = null!;
        public decimal DiscountPercent { get; set; }
        public decimal? MaxDiscountAmount { get; set; }
        public string? Description { get; set; }
        public string? Message { get; set; }
    }
}
