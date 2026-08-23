using Aura.Application.DTOs.Coupon;
using Aura.Application.Sevices.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Aura.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CouponController : ControllerBase
    {
        private readonly ICouponService _couponService;

        public CouponController(ICouponService couponService)
        {
            _couponService = couponService;
        }

        [HttpGet("active")]
        [AllowAnonymous]
        public async Task<IActionResult> GetActiveCampaign()
        {
            var active = await _couponService.GetActiveCampaignAsync();
            return Ok(active);
        }

        [HttpGet("validate/{code}")]
        [AllowAnonymous]
        public async Task<IActionResult> ValidateCoupon(string code)
        {
            var result = await _couponService.ValidateCouponAsync(code);
            return Ok(result);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var coupons = await _couponService.GetAllAsync();
            return Ok(coupons);
        }
    }
}
