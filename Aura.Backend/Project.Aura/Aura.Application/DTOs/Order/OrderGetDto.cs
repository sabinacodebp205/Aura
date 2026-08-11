using Aura.Application.DTOs.OrderItem;
using Aura.Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.DTOs.Order
{
    public class OrderGetDto
    {
        public Guid Id { get; set; }

        public decimal TotalPrice { get; set; }

        public OrderStatus Status { get; set; }

        public PaymentStatus PaymentStatus { get; set; }

        public List<OrderItemGetDto> OrderItems { get; set; } = new();
    }
}
