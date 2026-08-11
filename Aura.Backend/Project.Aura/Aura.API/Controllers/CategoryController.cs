using Aura.Application.DTOs.Category;
using Aura.Application.Sevices.Implementations;
using Microsoft.AspNetCore.Mvc;

namespace Aura.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _categoryService.GetAllAsync();

            return Ok(categories);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var category = await _categoryService.GetByIdAsync(id);

            if (category == null)
                return NotFound("Category not found.");

            return Ok(category);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CategoryCreateDto dto)
        {
            await _categoryService.CreateAsync(dto);

            return Ok("Category created successfully.");
        }

        [HttpPut]
        public async Task<IActionResult> Update(CategoryUpdateDto dto)
        {
            await _categoryService.UpdateAsync(dto);

            return Ok("Category updated successfully.");
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _categoryService.DeleteAsync(id);

            return Ok("Category deleted successfully.");
        }
    }
}