using Aura.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Core.Interfaces.Repositories
{
    public interface IOrderRepository : IGenericRepository<Order>
    {
        new Task<ICollection<Order>> FindAllAsync(System.Linq.Expressions.Expression<Func<Order, bool>> expression);
    }
}
