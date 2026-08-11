using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.DTOs.AppUser
{
    public class UpdateProfileDto
    {
        public string Name { get; set; } = null!;

        public string Surname { get; set; } = null!;

        public string UserName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string? ProfileImageUrl { get; set; }
    }

}
