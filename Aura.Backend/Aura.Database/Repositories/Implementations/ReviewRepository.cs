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
    public class ReviewRepository : GenericRepository<Review>, IReviewRepository
    {
        public ReviewRepository(AppDbContext context)
            : base(context)
        {
        }

        public override async Task<ICollection<Review>> GetAllAsync()
        {
            return await _dbSet
                .Include(r => r.User)
                .ToListAsync();
        }
    }
}
