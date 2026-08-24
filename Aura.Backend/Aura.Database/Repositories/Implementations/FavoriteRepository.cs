using Aura.Core.Entities;
using Aura.Core.Interfaces.Repositories;
using Aura.Database.Contexts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Aura.Database.Repositories.Implementations
{
    public class FavoriteRepository : GenericRepository<Favorite>, IFavoriteRepository
    {
        public FavoriteRepository(AppDbContext context)
            : base(context)
        {
        }

        public new async Task<ICollection<Favorite>> FindAllAsync(System.Linq.Expressions.Expression<Func<Favorite, bool>> expression)
        {
            return await _dbSet
                .Include(f => f.Product)
                    .ThenInclude(p => p.Images)
                .Where(expression)
                .ToListAsync();
        }
    }
}
