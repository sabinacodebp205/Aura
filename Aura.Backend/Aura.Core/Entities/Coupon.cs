using Aura.Core.Entities.Common;
using System;

namespace Aura.Core.Entities
{
    public class Coupon : BaseEntity
    {
        public string Code { get; set; } = null!;

        public decimal DiscountPercent { get; set; }

        public decimal? MaxDiscountAmount { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime? ExpiryDate { get; set; }

        public string? Description { get; set; }
    }
}
