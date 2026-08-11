using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Core.Interfaces.Repositories
{
    public interface IUnitOfWork
    {
        IAddressRepository AddressRepository { get; }
        ICategoryRepository CategoryRepository { get; }
        IDesignRepository DesignRepository { get; }
        IFavoriteRepository FavoriteRepository { get; }
        IOrderItemRepository OrderItemRepository { get; }
        IOrderRepository OrderRepository { get; }
        IProductImageRepository ProductImageRepository { get; }
        IProductRepository ProductRepository { get; }
        IReviewRepository ReviewRepository { get; }

        Task<int> SaveChangesAsync();
    }
}

