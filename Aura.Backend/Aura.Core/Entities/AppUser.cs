using Aura.Core.Enums;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Core.Entities
{
    public class AppUser : IdentityUser<Guid>
    {
        public string Name { get; set; } = null!;

        public string Surname { get; set; } = null!;

        public string? ProfileImageUrl { get; set; }

        public ICollection<Order> Orders { get; set; } = new List<Order>();

        public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();

        public ICollection<Review> Reviews { get; set; } = new List<Review>();

        public ICollection<Address> Addresses { get; set; } = new List<Address>();
        public UserRole Role { get; set; } = UserRole.User;
    }
}
