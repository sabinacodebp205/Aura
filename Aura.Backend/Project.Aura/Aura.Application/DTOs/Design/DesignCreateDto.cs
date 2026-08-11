using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.DTOs.Design
{
    public class DesignCreateDto
    {
        public string Prompt { get; set; } = null!;

        public Guid ProductId { get; set; }
    }
}
