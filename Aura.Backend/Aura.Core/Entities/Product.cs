using Aura.Core.Entities.Common;
using Aura.Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Core.Entities
{
    public class Product : BaseEntity
    {
        public string Name { get; set; } = null!;

        public string Description { get; set; } = null!;

        public decimal Price { get; set; }

        public int StockCount { get; set; }

        public string Color { get; set; } = null!;

        public string Size { get; set; } = null!;

        public bool IsCustomizable { get; set; }

        public ProductType ProductType { get; set; } = ProductType.Basic;

        public decimal? CustomizationFee { get; set; }

        public Guid? SourceDesignId { get; set; }

        public Guid CategoryId { get; set; }

        public Category Category { get; set; } = null!;

        public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();

        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

        public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();

        public ICollection<Design> Designs { get; set; } = new List<Design>();
    }
}
