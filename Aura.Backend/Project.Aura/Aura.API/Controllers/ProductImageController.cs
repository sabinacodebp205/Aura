using Aura.Application.DTOs.ProductImage;
using Aura.Application.Sevices.Interfaces;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Aura.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProductImageController : ControllerBase
    {
        private readonly IProductImageService _productImageService;
        private readonly IImageStorageService _imageStorageService;
        private readonly IValidator<ProductImageCreateDto> _createValidator;

        public ProductImageController(
            IProductImageService productImageService,
            IImageStorageService imageStorageService,
            IValidator<ProductImageCreateDto> createValidator)
        {
            _productImageService = productImageService;
            _imageStorageService = imageStorageService;
            _createValidator = createValidator;
        }

        [HttpGet("file/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetImageFile(string id)
        {
            var image = await _imageStorageService.GetImageAsync(id);
            if (image == null)
                return NotFound();

            return File(image.Data, image.ContentType);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var images = await _productImageService.GetAllAsync();

            return Ok(images);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var image = await _productImageService.GetByIdAsync(id);

            if (image == null)
                return NotFound("Image not found.");

            return Ok(image);
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Create([CustomizeValidator(Skip = true)] [FromForm] ProductImageCreateDto dto)
        {
            var validationResult = await _createValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors
                    .GroupBy(e => e.PropertyName)
                    .ToDictionary(
                        g => g.Key,
                        g => g.Select(e => e.ErrorMessage).ToArray()
                    );

                var firstError = validationResult.Errors.FirstOrDefault()?.ErrorMessage ?? "Validation failed.";

                return BadRequest(new
                {
                    message = firstError,
                    errors = errors
                });
            }

            try
            {
                await _productImageService.CreateAsync(dto);
                return Ok("Product image created successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Update([FromForm] ProductImageUpdateDto dto)
        {
            try
            {
                await _productImageService.UpdateAsync(dto);
                return Ok("Product image updated successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await _productImageService.DeleteAsync(id);
                return Ok("Product image deleted successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}