using Aura.Application.DTOs.Favorite;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Sevices.Interfaces
{
    public interface IFavoriteService
    {
        Task<ICollection<FavoriteGetDto>> GetAllAsync(Guid userId);

        Task<FavoriteGetDto?> GetByIdAsync(Guid id);

        Task CreateAsync(FavoriteCreateDto dto, Guid userId);

        Task DeleteAsync(Guid id);
    }
}
