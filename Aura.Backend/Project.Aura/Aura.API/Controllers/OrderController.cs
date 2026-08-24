using Aura.Application.DTOs.Order;
using Aura.Application.Sevices.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Aura.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
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