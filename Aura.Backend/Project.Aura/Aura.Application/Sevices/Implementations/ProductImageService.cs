using Aura.Application.DTOs.ProductImage;
using Aura.Application.Sevices.Interfaces;
using Aura.Core.Entities;
using Aura.Core.Interfaces.Repositories;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aura.Application.Sevices.Implementations
{
    public class ProductImageService : IProductImageService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IFileUploadService _fileUploadService;

        public ProductImageService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IFileUploadService fileUploadService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _fileUploadService = fileUploadService;
        }

        public async Task<ICollection<ProductImageGetDto>> GetAllAsync()
        {
            var images = await _unitOfWork.ProductImageRepository.GetAllAsync();

            return _mapper.Map<ICollection<ProductImageGetDto>>(images);
        }

        public async Task<ProductImageGetDto?> GetByIdAsync(Guid id)
        {
            var image = await _unitOfWork.ProductImageRepository.GetByIdAsync(id);

            if (image == null)
                return null;

            return _mapper.Map<ProductImageGetDto>(image);
        }

        public async Task CreateAsync(ProductImageCreateDto dto)
        {
            var product = await _unitOfWork.ProductRepository.GetByIdAsync(dto.ProductId);

            if (product == null)
                throw new Exception("Product not found.");

            var imageUrl = await _fileUploadService.SaveProductImageAsync(dto.ImageFile);

            var image = new ProductImage
            {
                ImageUrl = imageUrl,
                IsMain = dto.IsMain,
                ProductId = dto.ProductId
            };

            await _unitOfWork.ProductImageRepository.AddAsync(image);

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task UpdateAsync(ProductImageUpdateDto dto)
        {
            var image = await _unitOfWork.ProductImageRepository.GetByIdAsync(dto.Id);

            if (image == null)
                throw new Exception("Image not found.");

            if (dto.ImageFile != null)
            {
                _fileUploadService.DeleteProductImage(image.ImageUrl);

                var newImageUrl = await _fileUploadService.SaveProductImageAsync(dto.ImageFile);

                image.ImageUrl = newImageUrl;
            }

            image.IsMain = dto.IsMain;

            _unitOfWork.ProductImageRepository.Update(image);

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var image = await _unitOfWork.ProductImageRepository.GetByIdAsync(id);

            if (image == null)
                throw new Exception("Image not found.");

            _fileUploadService.DeleteProductImage(image.ImageUrl);

            _unitOfWork.ProductImageRepository.Delete(image);

            await _unitOfWork.SaveChangesAsync();
        }
    }
}