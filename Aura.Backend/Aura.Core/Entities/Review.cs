using Aura.Core.Entities.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Core.Entities
{
    public class Review : BaseEntity
    {
        public int Rating { get; set; }

        public string Comment { get; set; } = null!;

        public Guid UserId { get; set; }

        public AppUser User { get; set; } = null!;

        public Guid ProductId { get; set; }

        public Product Product { get; set; } = null!;
    }
}
