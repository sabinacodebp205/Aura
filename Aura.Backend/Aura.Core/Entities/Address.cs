using Aura.Core.Entities.Common;
using Aura.Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Core.Entities
{
    public class Address : BaseEntity
    {
        public string Country { get; set; } = null!;

        public string City { get; set; } = null!;

        public string Street { get; set; } = null!;

        public string ZipCode { get; set; } = null!;

        public Guid UserId { get; set; }

        public AppUser User { get; set; } = null!;
       
    }
}
