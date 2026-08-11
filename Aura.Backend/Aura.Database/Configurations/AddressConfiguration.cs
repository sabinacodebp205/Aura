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
    public class AddressConfiguration : IEntityTypeConfiguration<Address>
    {
        public void Configure(EntityTypeBuilder<Address> builder)
        {
            builder.Property(x => x.Country)
                   .HasMaxLength(100);

            builder.Property(x => x.City)
                   .HasMaxLength(100);

            builder.Property(x => x.Street)
                   .HasMaxLength(200);

            builder.Property(x => x.ZipCode)
                   .HasMaxLength(20);

            builder.HasOne(x => x.User)
                  .WithMany(x => x.Addresses)
                   .HasForeignKey(x => x.UserId)
                   .OnDelete(DeleteBehavior.Cascade);

        }
    }
}
