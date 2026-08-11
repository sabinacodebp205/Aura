using Aura.Application.DTOs.Design;
using Aura.Application.Sevices.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Aura.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DesignController : ControllerBase
    {
        private readonly IDesignService _designService;

        public DesignController(IDesignService designService)
        {
            _designService = designService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var designs = await _designService.GetAllAsync();

            return Ok(designs);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var design = await _designService.GetByIdAsync(id);

            if (design == null)
                return NotFound("Design not found.");

            return Ok(design);
        }

        [HttpPost]
        public async Task<IActionResult> Create(DesignCreateDto dto)
        {
            var userId = Guid.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            await _designService.CreateAsync(dto, userId);

            return Ok("Design created successfully.");
        }

        [HttpPut]
        public async Task<IActionResult> Update(DesignUpdateDto dto)
        {
            await _designService.UpdateAsync(dto);

            return Ok("Design updated successfully.");
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _designService.DeleteAsync(id);

            return Ok("Design deleted successfully.");
        }
    }
}