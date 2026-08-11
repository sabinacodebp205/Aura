using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Aura.Application.DTOs.ProductImage
{
    public class ProductImageCreateDto
    {
        public IFormFile ImageFile { get; set; } = null!;

        public bool IsMain { get; set; }

        public Guid ProductId { get; set; }
    }
}
