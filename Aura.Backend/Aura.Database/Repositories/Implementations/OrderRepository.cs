using Aura.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Aura.Core.Interfaces.Repositories;
using Aura.Database.Contexts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Database.Repositories.Implementations
{
    public class OrderRepository : GenericRepository<Order>, IOrderRepository
    {
        public OrderRepository(AppDbContext context)
            : base(context)
        {
        }

        public override async Task<ICollection<Order>> GetAllAsync()
        {
            return await _dbSet.Include(o => o.OrderItems).ThenInclude(oi => oi.Product).ToListAsync();
        }

        public override async Task<Order?> GetByIdAsync(Guid id)
        {
            return await _dbSet.Include(o => o.OrderItems).ThenInclude(oi => oi.Product).FirstOrDefaultAsync(o => o.Id == id);
        }

        public new async Task<ICollection<Order>> FindAllAsync(System.Linq.Expressions.Expression<Func<Order, bool>> expression)
        {
            return await _dbSet.Include(o => o.OrderItems).ThenInclude(oi => oi.Product).Where(expression).ToListAsync();
        }
    }
}
