using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.DTOs.ProductImage
{
    public class ProductImageGetDto
    {
        public Guid Id { get; set; }

        public string ImageUrl { get; set; } = null!;

        public bool IsMain { get; set; }
    }
}
