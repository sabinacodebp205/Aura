using Aura.Application.DTOs.Review;
using Aura.Application.Sevices.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Aura.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var reviews = await _reviewService.GetAllAsync();

            return Ok(reviews);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var review = await _reviewService.GetByIdAsync(id);

            if (review == null)
                return NotFound("Review not found.");

            return Ok(review);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create(ReviewCreateDto dto)
        {
            var userId = Guid.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            await _reviewService.CreateAsync(dto, userId);

            return Ok("Review created successfully.");
        }

        [Authorize]
        [HttpPut]
        public async Task<IActionResult> Update(ReviewUpdateDto dto)
        {
            await _reviewService.UpdateAsync(dto);

            return Ok("Review updated successfully.");
        }

        [Authorize]
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _reviewService.DeleteAsync(id);

            return Ok("Review deleted successfully.");
        }
    }
}