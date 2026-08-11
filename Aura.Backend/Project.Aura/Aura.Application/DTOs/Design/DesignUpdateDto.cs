using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.DTOs.Design
{
    public class DesignUpdateDto
    {
        public Guid Id { get; set; }

        public string Prompt { get; set; } = null!;
    }
}
