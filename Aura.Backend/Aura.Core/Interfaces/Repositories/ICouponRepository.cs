using Aura.Core.Entities;
using System.Threading.Tasks;

namespace Aura.Core.Interfaces.Repositories
{
    public interface ICouponRepository : IGenericRepository<Coupon>
    {
        Task<Coupon?> GetByCodeAsync(string code);
    }
}
