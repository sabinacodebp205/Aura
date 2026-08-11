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
    public class ReviewConfiguration : IEntityTypeConfiguration<Review>
    {
        public void Configure(EntityTypeBuilder<Review> builder)
        {
            builder.Property(x => x.Comment)
                   .HasMaxLength(500);

            builder.Property(x => x.Rating)
                   .IsRequired();

            builder.HasOne(x => x.User)
                   .WithMany(x => x.Reviews)
                   .HasForeignKey(x => x.UserId);

            builder.HasOne(x => x.Product)
                   .WithMany(x => x.Reviews)
                   .HasForeignKey(x => x.ProductId);
        }
    }
}
