using Aura.Application.DTOs.Favorite;
using Aura.Application.Sevices.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Aura.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FavoriteController : ControllerBase
    {
        private readonly IFavoriteService _favoriteService;

        public FavoriteController(IFavoriteService favoriteService)
        {
            _favoriteService = favoriteService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var favorites = await _favoriteService.GetAllAsync(userId);

            return Ok(favorites);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var favorite = await _favoriteService.GetByIdAsync(id);

            if (favorite == null)
                return NotFound("Favorite not found.");

            return Ok(favorite);
        }

        [HttpPost]
        public async Task<IActionResult> Create(FavoriteCreateDto dto)
        {
            var userId = Guid.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            await _favoriteService.CreateAsync(dto, userId);

            return Ok("Product added to favorites successfully.");
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _favoriteService.DeleteAsync(id);

            return Ok("Favorite deleted successfully.");
        }
    }
}