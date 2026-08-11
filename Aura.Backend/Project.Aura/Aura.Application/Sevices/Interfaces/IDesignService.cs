using Aura.Application.DTOs.Design;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Sevices.Interfaces
{
    public interface IDesignService
    {
        Task<ICollection<DesignGetDto>> GetAllAsync();

        Task<DesignGetDto?> GetByIdAsync(Guid id);

        Task CreateAsync(DesignCreateDto dto, Guid userId);

        Task UpdateAsync(DesignUpdateDto dto);

        Task DeleteAsync(Guid id);
    }
}
