using Aura.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Core.Interfaces.Repositories
{
    public interface IProductRepository : IGenericRepository<Product>
    {
        Task<ICollection<Product>> GetAllWithDetailsAsync();
        Task<Product?> GetByIdWithDetailsAsync(Guid id);
    }
}

