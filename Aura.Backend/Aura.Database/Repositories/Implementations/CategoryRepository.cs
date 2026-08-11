using Aura.Core.Entities;
using Aura.Core.Interfaces.Repositories;
using Aura.Database.Contexts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Database.Repositories.Implementations
{
    public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
    {
        public CategoryRepository(AppDbContext context)
            : base(context)
        {
        }
    }
}