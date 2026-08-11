using Aura.Application.DTOs.Category;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Sevices.Implementations
{
    public interface ICategoryService
    {
        Task<ICollection<CategoryGetDto>> GetAllAsync();

        Task<CategoryGetDto?> GetByIdAsync(Guid id);

        Task CreateAsync(CategoryCreateDto dto);

        Task UpdateAsync(CategoryUpdateDto dto);

        Task DeleteAsync(Guid id);
    }
}
