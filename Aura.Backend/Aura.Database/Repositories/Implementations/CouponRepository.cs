using Aura.Core.Entities;
using Aura.Core.Interfaces.Repositories;
using Aura.Database.Contexts;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Aura.Database.Repositories.Implementations
{
    public class CouponRepository : GenericRepository<Coupon>, ICouponRepository
    {
        public CouponRepository(AppDbContext context)
            : base(context)
        {
        }

        public async Task<Coupon?> GetByCodeAsync(string code)
        {
            if (string.IsNullOrWhiteSpace(code))
                return null;

            var normalized = code.Trim().ToUpper();
            return await _context.Set<Coupon>()
                .FirstOrDefaultAsync(c => !c.IsDeleted && c.Code.ToUpper() == normalized);
        }
    }
}
