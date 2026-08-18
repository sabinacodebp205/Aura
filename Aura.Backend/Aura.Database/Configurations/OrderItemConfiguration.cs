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
    public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
    {
        public void Configure(EntityTypeBuilder<OrderItem> builder)
        {
            builder.Property(x => x.Quantity)
                   .IsRequired();

           

            builder.HasOne(x => x.Product)
                   .WithMany(x => x.OrderItems)
                   .HasForeignKey(x => x.ProductId);
        }
    }
}
