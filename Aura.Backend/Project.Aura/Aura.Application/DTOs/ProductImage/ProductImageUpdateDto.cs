using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Aura.Application.DTOs.ProductImage
{
    public class ProductImageUpdateDto
    {
        public Guid Id { get; set; }

        public IFormFile? ImageFile { get; set; }

        public bool IsMain { get; set; }
    }
}
