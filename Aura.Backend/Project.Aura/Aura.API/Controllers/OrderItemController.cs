using Aura.Application.DTOs.OrderItem;
using Aura.Application.Sevices.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Aura.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrderItemController : ControllerBase
    {
        private readonly IOrderItemService _orderItemService;

        public OrderItemController(IOrderItemService orderItemService)
        {
            _orderItemService = orderItemService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orderItems = await _orderItemService.GetAllAsync();

            return Ok(orderItems);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var orderItem = await _orderItemService.GetByIdAsync(id);

            if (orderItem == null)
                return NotFound("Order item not found.");

            return Ok(orderItem);
        }

        [HttpPost]
        public async Task<IActionResult> Create(OrderItemCreateDto dto)
        {
            await _orderItemService.CreateAsync(dto);

            return Ok("Order item created successfully.");
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, OrderItemCreateDto dto)
        {
            await _orderItemService.UpdateAsync(id, dto);

            return Ok("Order item updated successfully.");
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _orderItemService.DeleteAsync(id);

            return Ok("Order item deleted successfully.");
        }
    }
}