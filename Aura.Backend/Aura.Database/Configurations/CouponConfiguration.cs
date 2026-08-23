using Aura.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aura.Database.Configurations
{
    public class CouponConfiguration : IEntityTypeConfiguration<Coupon>
    {
        public void Configure(EntityTypeBuilder<Coupon> builder)
        {
            builder.HasKey(c => c.Id);

            builder.Property(c => c.Code)
                .IsRequired()
                .HasMaxLength(50);

            builder.HasIndex(c => c.Code)
                .IsUnique();

            builder.Property(c => c.DiscountPercent)
                .HasColumnType("decimal(18,2)")
                .IsRequired();

            builder.Property(c => c.MaxDiscountAmount)
                .HasColumnType("decimal(18,2)");
        }
    }
}
