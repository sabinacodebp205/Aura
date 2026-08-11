using Aura.Application.DTOs.Review;
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
    public class ReviewService : IReviewService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ReviewService(
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<ICollection<ReviewGetDto>> GetAllAsync()
        {
            var reviews = await _unitOfWork.ReviewRepository.GetAllAsync();

            return _mapper.Map<ICollection<ReviewGetDto>>(reviews);
        }

        public async Task<ReviewGetDto?> GetByIdAsync(Guid id)
        {
            var review = await _unitOfWork.ReviewRepository.GetByIdAsync(id);

            if (review == null)
                return null;

            return _mapper.Map<ReviewGetDto>(review);
        }

        public async Task CreateAsync(ReviewCreateDto dto, Guid userId)
        {
            var product = await _unitOfWork.ProductRepository.GetByIdAsync(dto.ProductId);

            if (product == null)
                throw new Exception("Product not found.");

            bool exists = await _unitOfWork.ReviewRepository.AnyAsync(x =>
                x.ProductId == dto.ProductId &&
                x.UserId == userId);

            if (exists)
                throw new Exception("You have already reviewed this product.");

            var review = _mapper.Map<Review>(dto);

            review.UserId = userId;

            await _unitOfWork.ReviewRepository.AddAsync(review);

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task UpdateAsync(ReviewUpdateDto dto)
        {
            var review = await _unitOfWork.ReviewRepository.GetByIdAsync(dto.Id);

            if (review == null)
                throw new Exception("Review not found.");

            review.Rating = dto.Rating;
            review.Comment = dto.Comment;

            _unitOfWork.ReviewRepository.Update(review);

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var review = await _unitOfWork.ReviewRepository.GetByIdAsync(id);

            if (review == null)
                throw new Exception("Review not found.");

            _unitOfWork.ReviewRepository.Delete(review);

            await _unitOfWork.SaveChangesAsync();
        }
    }
}
