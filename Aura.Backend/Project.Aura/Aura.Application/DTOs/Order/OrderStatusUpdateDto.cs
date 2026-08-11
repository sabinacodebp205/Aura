using Aura.Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.DTOs.Order
{
    public class OrderStatusUpdateDto
    {
        public Guid Id { get; set; }

        public OrderStatus Status { get; set; }
    }
}
