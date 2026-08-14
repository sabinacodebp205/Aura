using Aura.Application.DTOs.AiStudio;
using Aura.Application.Sevices.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Aura.API.Controllers
{
    [Route("api/ai-studio")]
    [ApiController]
    public class AiStudioController : ControllerBase
    {
        private readonly IAiStudioService _aiStudioService;
        private readonly IFileUploadService _fileUploadService;

        public AiStudioController(IAiStudioService aiStudioService, IFileUploadService fileUploadService)
        {
            _aiStudioService = aiStudioService;
            _fileUploadService = fileUploadService;
        }

        [HttpPost("chat")]
        [AllowAnonymous]
        public async Task<IActionResult> Chat([FromBody] ChatRequestDto dto)
        {
            var response = await _aiStudioService.ProcessChatAsync(dto);
            return Ok(response);
        }

        [HttpPost("generate")]
        [AllowAnonymous]
        public async Task<IActionResult> Generate([FromBody] GenerateRequestDto dto)
        {
            var response = await _aiStudioService.GenerateGarmentDesignAsync(dto);
            return Ok(response);
        }

        [HttpPost("upload-pattern")]
        [AllowAnonymous]
        public async Task<IActionResult> UploadPattern(IFormFile file)
        {
            try
            {
                var url = await _fileUploadService.SaveDesignPatternAsync(file);
                return Ok(new { url });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("designs")]
        [Authorize]
        public async Task<IActionResult> GetSavedDesigns()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdString, out var userId))
                return Unauthorized();

            var designs = await _aiStudioService.GetSavedDesignsAsync(userId);
            return Ok(designs);
        }

        [HttpGet("designs/{id:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetSavedDesignById(Guid id)
        {
            var design = await _aiStudioService.GetSavedDesignByIdAsync(id);
            if (design == null)
                return NotFound("Design not found.");

            return Ok(design);
        }

        [HttpPost("designs")]
        [AllowAnonymous]
        public async Task<IActionResult> SaveDesign([FromBody] SaveDesignDto dto)
        {
            Guid? userId = null;
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (Guid.TryParse(userIdString, out var parsedId))
            {
                userId = parsedId;
            }

            var savedDesign = await _aiStudioService.SaveDesignAsync(dto, userId);
            return Ok(savedDesign);
        }

        [HttpPost("designs/{id:guid}/duplicate")]
        [Authorize]
        public async Task<IActionResult> DuplicateDesign(Guid id)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdString, out var userId))
                return Unauthorized();

            try
            {
                var duplicated = await _aiStudioService.DuplicateDesignAsync(id, userId);
                return Ok(duplicated);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("designs/{id:guid}")]
        [Authorize]
        public async Task<IActionResult> DeleteDesign(Guid id)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdString, out var userId))
                return Unauthorized();

            await _aiStudioService.DeleteSavedDesignAsync(id, userId);
            return Ok(new { message = "Design deleted successfully." });
        }

        [HttpPost("products/custom")]
        [AllowAnonymous]
        public async Task<IActionResult> CreateCustomProduct([FromBody] CustomProductCreateDto dto)
        {
            Guid? userId = null;
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (Guid.TryParse(userIdString, out var parsedId))
            {
                userId = parsedId;
            }

            var customProduct = await _aiStudioService.CreateCustomProductAsync(dto, userId);
            return Ok(customProduct);
        }
    }
}
