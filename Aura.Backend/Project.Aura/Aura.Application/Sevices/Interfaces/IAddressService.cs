using Aura.Application.DTOs.Address;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Sevices.Interfaces
{
    public interface IAddressService
    {
        Task<ICollection<AddressGetDto>> GetAllAsync();

        Task<AddressGetDto?> GetByIdAsync(Guid id);

        Task CreateAsync(AddressCreateDto dto, Guid userId);

        Task UpdateAsync(AddressUpdateDto dto);

        Task DeleteAsync(Guid id);
    }
}
