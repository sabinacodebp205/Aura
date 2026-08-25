using Aura.Application.DTOs.Order;
using Aura.Application.Sevices.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Aura.Core.Entities;
using Aura.Application.Sevices.Interfaces;

namespace Aura.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly UserManager<AppUser> _userManager;
        private readonly IAddressService _addressService;

        public OrderController(IOrderService orderService, UserManager<AppUser> userManager, IAddressService addressService)
        {
            _orderService = orderService;
            _userManager = userManager;
            _addressService = addressService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var orders = await _orderService.GetAllByUserIdAsync(userId);

            return Ok(orders);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var order = await _orderService.GetByIdAsync(id);

            if (order == null)
                return NotFound("Order not found.");

            return Ok(order);
        }

        [HttpPost]
        public async Task<IActionResult> Create(OrderCreateDto dto)
        {
            var userId = Guid.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
                return Unauthorized();

            if (string.IsNullOrWhiteSpace(user.Name) || 
                string.IsNullOrWhiteSpace(user.Surname) ||
                string.IsNullOrWhiteSpace(user.Email))
            {
                return BadRequest(new { message = "Sifariş vermək üçün profil məlumatlarınızı (Ad, Soyad, Email) tamamlayın." });
            }

            var address = await _addressService.GetByIdAsync(dto.AddressId);
            if (address == null)
            {
                return BadRequest(new { message = "Seçilmiş ünvan tapılmadı. Zəhmət olmasa ünvan əlavə edin." });
            }

            string expectedName = $"{user.Name} {user.Surname}".Trim();
            if (dto.Name != expectedName || dto.Email != user.Email)
            {
                return BadRequest(new { message = "Sifariş məlumatları profil məlumatları ilə uyğun gəlmir." });
            }

            await _orderService.CreateAsync(dto, userId);

            return Ok("Order created successfully.");
        }

        [HttpPut]
        public async Task<IActionResult> Update(OrderUpdateDto dto)
        {
            await _orderService.UpdateAsync(dto);

            return Ok("Order updated successfully.");
        }

        [HttpPatch("status")]
        public async Task<IActionResult> UpdateStatus(OrderStatusUpdateDto dto)
        {
            await _orderService.UpdateStatusAsync(dto);

            return Ok("Order status updated successfully.");
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _orderService.DeleteAsync(id);

            return Ok("Order deleted successfully.");
        }
    }
}