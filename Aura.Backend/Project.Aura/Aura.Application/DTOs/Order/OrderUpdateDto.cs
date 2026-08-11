using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.DTOs.Order
{
    public class OrderUpdateDto
    {
        public Guid Id { get; set; }

        public Guid AddressId { get; set; }
    }
}
