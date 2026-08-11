using Aura.Application.DTOs.OrderItem;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Sevices.Interfaces
{
    public interface IOrderItemService
    {
        Task<ICollection<OrderItemGetDto>> GetAllAsync();

        Task<OrderItemGetDto?> GetByIdAsync(Guid id);

        Task CreateAsync(OrderItemCreateDto dto);

        Task UpdateAsync(Guid id, OrderItemCreateDto dto);

        Task DeleteAsync(Guid id);
    }
}
