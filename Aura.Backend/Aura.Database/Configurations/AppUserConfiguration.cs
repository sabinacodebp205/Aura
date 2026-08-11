using Aura.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Database.Configurations
{
    public class AppUserConfiguration : IEntityTypeConfiguration<AppUser>
    {
        public void Configure(EntityTypeBuilder<AppUser> builder)
        {
            builder.Property(x => x.Name)
                   .HasMaxLength(50);

            builder.Property(x => x.Surname)
                   .HasMaxLength(50);

            builder.Property(x => x.ProfileImageUrl)
                   .HasMaxLength(500);
        }
    }
}
