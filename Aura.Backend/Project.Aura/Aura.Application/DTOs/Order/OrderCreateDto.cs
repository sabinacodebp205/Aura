using Aura.Application.DTOs.OrderItem;
using System;
using System.Collections.Generic;

namespace Aura.Application.DTOs.Order
{
    public class OrderCreateDto
    {
        public Guid AddressId { get; set; }

        public string? Name { get; set; }
        
        public string? Email { get; set; }

        public string? CouponCode { get; set; }

        public List<OrderItemCreateDto> OrderItems { get; set; } = new();
    }
}
