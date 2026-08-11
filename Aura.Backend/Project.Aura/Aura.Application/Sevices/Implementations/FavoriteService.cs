using Aura.Application.DTOs.Favorite;
using Aura.Application.Sevices.Interfaces;
using Aura.Core.Entities;
using Aura.Core.Interfaces.Repositories;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Sevices.Implementations
{
    public class FavoriteService : IFavoriteService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public FavoriteService(
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<ICollection<FavoriteGetDto>> GetAllAsync()
        {
            var favorites = await _unitOfWork.FavoriteRepository.GetAllAsync();

            return _mapper.Map<ICollection<FavoriteGetDto>>(favorites);
        }

        public async Task<FavoriteGetDto?> GetByIdAsync(Guid id)
        {
            var favorite = await _unitOfWork.FavoriteRepository.GetByIdAsync(id);

            if (favorite == null)
                return null;

            return _mapper.Map<FavoriteGetDto>(favorite);
        }

        public async Task CreateAsync(FavoriteCreateDto dto, Guid userId)
        {
            var product = await _unitOfWork.ProductRepository.GetByIdAsync(dto.ProductId);

            if (product == null)
                throw new Exception("Product not found.");

            bool exists = await _unitOfWork.FavoriteRepository.AnyAsync(x =>
                x.ProductId == dto.ProductId &&
                x.UserId == userId);

            if (exists)
                throw new Exception("Product already exists in favorites.");

            Favorite favorite = new Favorite
            {
                ProductId = dto.ProductId,
                UserId = userId
            };

            await _unitOfWork.FavoriteRepository.AddAsync(favorite);

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var favorite = await _unitOfWork.FavoriteRepository.GetByIdAsync(id);

            if (favorite == null)
                throw new Exception("Favorite not found.");

            _unitOfWork.FavoriteRepository.Delete(favorite);

            await _unitOfWork.SaveChangesAsync();
        }
    }
}
