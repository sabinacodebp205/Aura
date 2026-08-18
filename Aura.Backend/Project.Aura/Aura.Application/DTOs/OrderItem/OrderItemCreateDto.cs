using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.DTOs.OrderItem
{
    public class OrderItemCreateDto
    {
       
        public Guid ProductId { get; set; }

        public int Quantity { get; set; }
    }
}
