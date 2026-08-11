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
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.Property(x => x.Price)
        .HasPrecision(18, 2);

            builder.Property(x => x.Name)
                   .HasMaxLength(150);

            builder.Property(x => x.Description)
                   .HasMaxLength(2000);

            builder.Property(x => x.Color)
                   .HasMaxLength(50);

            builder.Property(x => x.Size)
                   .HasMaxLength(20);

            builder.HasOne(x => x.Category)
                   .WithMany(x => x.Products)
                   .HasForeignKey(x => x.CategoryId);
           
        }
    }
}
