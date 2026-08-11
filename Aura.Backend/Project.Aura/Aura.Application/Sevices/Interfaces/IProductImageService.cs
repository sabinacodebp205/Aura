using Aura.Application.DTOs.ProductImage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Sevices.Interfaces
{
    public interface IProductImageService
    {
        Task<ICollection<ProductImageGetDto>> GetAllAsync();

        Task<ProductImageGetDto?> GetByIdAsync(Guid id);

        Task CreateAsync(ProductImageCreateDto dto);

        Task UpdateAsync(ProductImageUpdateDto dto);

        Task DeleteAsync(Guid id);
    }
}
