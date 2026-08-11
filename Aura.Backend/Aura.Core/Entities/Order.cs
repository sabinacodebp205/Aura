using Aura.Core.Entities.Common;
using Aura.Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Core.Entities
{
    public class Order : BaseEntity
    {
        public Guid UserId { get; set; }

        public AppUser User { get; set; } = null!;

        public Guid AddressId { get; set; }

        public Address Address { get; set; } = null!;

        public decimal TotalPrice { get; set; }

        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public OrderStatus Status { get; set; }

        public PaymentStatus PaymentStatus { get; set; }
    }
}
