using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.DTOs.Product
{

    public class ProductCreateDto
    {
        public string Name { get; set; } = null!;

        public string Description { get; set; } = null!;

        public decimal Price { get; set; }

        public int StockCount { get; set; }

        public string Color { get; set; } = null!;

        public string Size { get; set; } = null!;

        public bool IsCustomizable { get; set; }

        public Guid CategoryId { get; set; }
    }
}
