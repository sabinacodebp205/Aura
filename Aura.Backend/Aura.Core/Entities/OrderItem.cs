using Aura.Core.Entities.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Core.Entities
{
    public class OrderItem : BaseEntity
    {
        public Guid OrderId { get; set; }

        public Order Order { get; set; } = null!;

        public Guid ProductId { get; set; }

        public Product Product { get; set; } = null!;

        public int Quantity { get; set; }
    }
}
