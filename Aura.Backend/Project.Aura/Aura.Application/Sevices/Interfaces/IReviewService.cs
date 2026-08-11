using Aura.Application.DTOs.Review;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Sevices.Interfaces
{
    public interface IReviewService
    {
        Task<ICollection<ReviewGetDto>> GetAllAsync();

        Task<ReviewGetDto?> GetByIdAsync(Guid id);

        Task CreateAsync(ReviewCreateDto dto, Guid userId);

        Task UpdateAsync(ReviewUpdateDto dto);

        Task DeleteAsync(Guid id);
    }
}
