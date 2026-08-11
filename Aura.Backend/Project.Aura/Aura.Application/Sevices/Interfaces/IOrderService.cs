using Aura.Application.DTOs.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Sevices.Interfaces
{
    public interface IOrderService
    {
        Task<ICollection<OrderGetDto>> GetAllAsync();

        Task<OrderGetDto?> GetByIdAsync(Guid id);

        Task CreateAsync(OrderCreateDto dto, Guid userId);

        Task UpdateAsync(OrderUpdateDto dto);

        Task UpdateStatusAsync(OrderStatusUpdateDto dto);

        Task DeleteAsync(Guid id);
    }
}
