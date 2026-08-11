using Aura.Application.DTOs.Product;
using Aura.Application.Sevices.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Aura.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _productService.GetAllAsync();

            return Ok(products);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var product = await _productService.GetByIdAsync(id);

            if (product == null)
                return NotFound("Product not found.");

            return Ok(product);
        }

        [HttpPost]
        public async Task<IActionResult> Create(ProductCreateDto dto)
        {
            await _productService.CreateAsync(dto);

            return Ok("Product created successfully.");
        }

        [HttpPut]
        public async Task<IActionResult> Update(ProductUpdateDto dto)
        {
            await _productService.UpdateAsync(dto);

            return Ok("Product updated successfully.");
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _productService.DeleteAsync(id);

            return Ok("Product deleted successfully.");
        }
    }
}