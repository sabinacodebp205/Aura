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
        public string Name { get; set; } = "Custom AI Design";

        public string GarmentType { get; set; } = "hoodie";

        public string Color { get; set; } = "black";

        public string? Prompt { get; set; }

        public string ImageUrl { get; set; } = string.Empty;

        public string? UploadedPatternUrl { get; set; }

        public string? Style { get; set; }

        public string? Placement { get; set; }

        public string? PrintSize { get; set; }

        public string Status { get; set; } = "draft";

        public int GenerationAttempts { get; set; } = 1;

        public bool IsFavorite { get; set; } = false;

        public decimal ExtraPrice { get; set; } = 15.00m;

        public Guid? UserId { get; set; }

        public AppUser? User { get; set; }

        public Guid? ProductId { get; set; }

        public Product? Product { get; set; }
    }

}
