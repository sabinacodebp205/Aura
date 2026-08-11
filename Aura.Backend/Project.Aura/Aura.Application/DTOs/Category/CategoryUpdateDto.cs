using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.DTOs.Category
{
    public class CategoryUpdateDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = null!;
    }
}
