using Aura.Application.DTOs.Address;
using Aura.Application.Sevices.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Aura.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AddressController : ControllerBase
    {
        private readonly IAddressService _addressService;

        public AddressController(IAddressService addressService)
        {
            _addressService = addressService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = Guid.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var addresses = await _addressService.GetAllAsync(userId);

            return Ok(addresses);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var address = await _addressService.GetByIdAsync(id);

            if (address == null)
                return NotFound("Address not found.");

            return Ok(address);
        }

        [HttpPost]
        public async Task<IActionResult> Create(AddressCreateDto dto)
        {
            var userId = Guid.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            await _addressService.CreateAsync(dto, userId);

            return Ok("Address created successfully.");
        }

        [HttpPut]
        public async Task<IActionResult> Update(AddressUpdateDto dto)
        {
            await _addressService.UpdateAsync(dto);

            return Ok("Address updated successfully.");
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _addressService.DeleteAsync(id);

            return Ok("Address deleted successfully.");
        }
    }
}