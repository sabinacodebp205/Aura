using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.DTOs.Design
{
    public class DesignGetDto
    {
        public Guid Id { get; set; }

        public string Prompt { get; set; } = null!;

        public string ImageUrl { get; set; } = null!;

        public decimal ExtraPrice { get; set; }

        public Guid ProductId { get; set; }
    }
}
