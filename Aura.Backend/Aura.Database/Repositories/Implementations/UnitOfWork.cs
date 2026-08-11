using Aura.Core.Interfaces.Repositories;
using Aura.Database.Contexts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Database.Repositories.Implementations
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        public IAddressRepository AddressRepository { get; }
        public ICategoryRepository CategoryRepository { get; }
        public IDesignRepository DesignRepository { get; }
        public IFavoriteRepository FavoriteRepository { get; }
        public IOrderItemRepository OrderItemRepository { get; }
        public IOrderRepository OrderRepository { get; }
        public IProductImageRepository ProductImageRepository { get; }
        public IProductRepository ProductRepository { get; }
        public IReviewRepository ReviewRepository { get; }

        public UnitOfWork(
            AppDbContext context,
            IAddressRepository addressRepository,
            ICategoryRepository categoryRepository,
            IDesignRepository designRepository,
            IFavoriteRepository favoriteRepository,
            IOrderItemRepository orderItemRepository,
            IOrderRepository orderRepository,
            IProductImageRepository productImageRepository,
            IProductRepository productRepository,
            IReviewRepository reviewRepository)
        {
            _context = context;

            AddressRepository = addressRepository;
            CategoryRepository = categoryRepository;
            DesignRepository = designRepository;
            FavoriteRepository = favoriteRepository;
            OrderItemRepository = orderItemRepository;
            OrderRepository = orderRepository;
            ProductImageRepository = productImageRepository;
            ProductRepository = productRepository;
            ReviewRepository = reviewRepository;
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
