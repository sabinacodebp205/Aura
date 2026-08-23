using Aura.Application.DTOs.Coupon;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aura.Application.Sevices.Interfaces
{
    public interface ICouponService
    {
        Task<CouponValidationResultDto> ValidateCouponAsync(string code);
        Task<CouponDto?> GetActiveCampaignAsync();
        Task<ICollection<CouponDto>> GetAllAsync();
    }
}
