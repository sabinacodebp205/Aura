using Aura.Core.Entities.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Core.Entities
{
    public class ProductImage : BaseEntity
    {
        public string ImageUrl { get; set; } = null!;

        public bool IsMain { get; set; }

        public Guid ProductId { get; set; }

        public Product Product { get; set; } = null!;
    }
}
