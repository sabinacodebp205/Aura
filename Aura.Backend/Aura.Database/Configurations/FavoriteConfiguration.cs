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
    public class FavoriteConfiguration : IEntityTypeConfiguration<Favorite>
    {
        public void Configure(EntityTypeBuilder<Favorite> builder)
        {
            builder.HasOne(x => x.User)
                   .WithMany(x => x.Favorites)
                   .HasForeignKey(x => x.UserId);

            

            builder.HasIndex(x => new
            {
                x.UserId,
                x.ProductId
            }).IsUnique();

             builder.HasOne(x => x.Product)
                    .WithMany(x => x.Favorites)
                    .HasForeignKey(x => x.ProductId);
        }
    }
}
