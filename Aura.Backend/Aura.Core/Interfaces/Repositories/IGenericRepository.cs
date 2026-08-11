using Aura.Core.Entities.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Core.Interfaces.Repositories
{
    public interface IGenericRepository<T> where T : BaseEntity
    {
        Task<T?> GetByIdAsync(Guid id);

        Task<ICollection<T>> GetAllAsync();

        Task<ICollection<T>> FindAllAsync(Expression<Func<T, bool>> expression);

        Task<T?> FindAsync(Expression<Func<T, bool>> expression);

        Task AddAsync(T entity);

        void Update(T entity);

        void Delete(T entity);

        Task<bool> AnyAsync(Expression<Func<T, bool>> expression);

       
    }
}
