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
    public class DesignConfiguration : IEntityTypeConfiguration<Design>
    {
        public void Configure(EntityTypeBuilder<Design> builder)
        {
            builder.Property(x => x.Prompt)
                   .HasMaxLength(1000);

            builder.Property(x => x.ImageUrl)
                   .HasMaxLength(500);

            builder.Property(x => x.ExtraPrice)
                   .HasPrecision(18, 2);

            builder.HasOne(x => x.User)
                   .WithMany(x => x.Designs)
                   .HasForeignKey(x => x.UserId);

          
            builder.HasOne(x => x.Product)
                   .WithMany(x => x.Designs)
                   .HasForeignKey(x => x.ProductId);
        }
    }
}
