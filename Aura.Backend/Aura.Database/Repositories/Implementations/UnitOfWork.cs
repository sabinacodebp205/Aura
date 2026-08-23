using Aura.Core.Interfaces.Repositories;
using Aura.Database.Contexts;
using System.Threading.Tasks;

namespace Aura.Database.Repositories.Implementations
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        public IAddressRepository AddressRepository { get; }
        public ICategoryRepository CategoryRepository { get; }
        public IFavoriteRepository FavoriteRepository { get; }
        public IOrderItemRepository OrderItemRepository { get; }
        public IOrderRepository OrderRepository { get; }
        public IProductImageRepository ProductImageRepository { get; }
        public IProductRepository ProductRepository { get; }
        public IReviewRepository ReviewRepository { get; }
        public ICouponRepository CouponRepository { get; }

        public UnitOfWork(
            AppDbContext context,
            IAddressRepository addressRepository,
            ICategoryRepository categoryRepository,
            IFavoriteRepository favoriteRepository,
            IOrderItemRepository orderItemRepository,
            IOrderRepository orderRepository,
            IProductImageRepository productImageRepository,
            IProductRepository productRepository,
            IReviewRepository reviewRepository,
            ICouponRepository couponRepository)
        {
            _context = context;

            AddressRepository = addressRepository;
            CategoryRepository = categoryRepository;
            FavoriteRepository = favoriteRepository;
            OrderItemRepository = orderItemRepository;
            OrderRepository = orderRepository;
            ProductImageRepository = productImageRepository;
            ProductRepository = productRepository;
            ReviewRepository = reviewRepository;
            CouponRepository = couponRepository;
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
