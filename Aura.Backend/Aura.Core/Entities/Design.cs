using Aura.Core.Entities.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Core.Entities
{
    public class Design : BaseEntity
    {
        public string Prompt { get; set; } = null!;

        public string ImageUrl { get; set; } = null!;

        public decimal ExtraPrice { get; set; }

        public Guid UserId { get; set; }

        public AppUser User { get; set; } = null!;

        public Guid ProductId { get; set; }

        public Product Product { get; set; } = null!;
    }
}
