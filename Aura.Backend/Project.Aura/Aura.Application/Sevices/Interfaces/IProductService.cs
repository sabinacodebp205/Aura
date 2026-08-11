using Aura.Application.DTOs.Product;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Sevices.Interfaces
{
    public interface IProductService
    {
        Task<ICollection<ProductGetDto>> GetAllAsync();

        Task<ProductDetailsDto?> GetByIdAsync(Guid id);

        Task CreateAsync(ProductCreateDto dto);

        Task UpdateAsync(ProductUpdateDto dto);

        Task DeleteAsync(Guid id);
    }
}
