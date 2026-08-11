using Aura.Application.DTOs.AppUser;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Sevices.Interfaces
{
    public interface IAppUserService
    {
        Task<ICollection<UserGetDto>> GetAllAsync();

        Task<UserGetDto?> GetByIdAsync(Guid id);

        Task UpdateProfileAsync(Guid id, UpdateProfileDto dto);

        Task DeleteAsync(Guid id);
    }
}
