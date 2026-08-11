using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.DTOs.Review
{
    public class ReviewGetDto
    {
        public Guid Id { get; set; }

        public int Rating { get; set; }

        public string Comment { get; set; } = null!;

        public string UserName { get; set; } = null!;
    }

}
