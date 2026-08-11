using Aura.Application.DTOs.OrderItem;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.DTOs.Order
{
    public class OrderCreateDto
    {
        public Guid AddressId { get; set; }

        public List<OrderItemCreateDto> OrderItems { get; set; } = new();
    }
}
