using Aura.Application.DTOs.ProductImage;
using Aura.Application.Sevices.Interfaces;
using Aura.Core.Entities;
using Aura.Core.Interfaces.Repositories;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Aura.Application.Sevices.Implementations
{
    public class ProductImageService : IProductImageService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IImageStorageService _imageStorageService;

        public ProductImageService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IImageStorageService imageStorageService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _imageStorageService = imageStorageService;
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

            var existingImages = await _unitOfWork.ProductImageRepository.FindAllAsync(x => x.ProductId == dto.ProductId);
            bool isMain = dto.IsMain;

            // If it's the first image ever added for a product, force IsMain = true
            if (!existingImages.Any())
            {
                isMain = true;
            }
            else if (isMain)
            {
                // Unset IsMain on all existing images for this product
                foreach (var img in existingImages.Where(x => x.IsMain))
                {
                    img.IsMain = false;
                    _unitOfWork.ProductImageRepository.Update(img);
                }
            }

            var imageId = await _imageStorageService.SaveImageAsync(dto.ImageFile);
            var imageUrl = $"/api/ProductImage/file/{imageId}";

            var image = new ProductImage
            {
                ImageUrl = imageUrl,
                IsMain = isMain,
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

            if (dto.IsMain)
            {
                var existingMainImages = await _unitOfWork.ProductImageRepository.FindAllAsync(x => x.ProductId == image.ProductId && x.Id != image.Id && x.IsMain);
                foreach (var img in existingMainImages)
                {
                    img.IsMain = false;
                    _unitOfWork.ProductImageRepository.Update(img);
                }
            }

            if (dto.ImageFile != null)
            {
                await _imageStorageService.DeleteImageAsync(image.ImageUrl);

                var newImageId = await _imageStorageService.SaveImageAsync(dto.ImageFile);

                image.ImageUrl = $"/api/ProductImage/file/{newImageId}";
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

            bool wasMain = image.IsMain;
            Guid productId = image.ProductId;

            await _imageStorageService.DeleteImageAsync(image.ImageUrl);

            _unitOfWork.ProductImageRepository.Delete(image);

            // If deleting the main image and other images exist, promote one of the remaining images to IsMain = true
            if (wasMain)
            {
                var remainingImages = await _unitOfWork.ProductImageRepository.FindAllAsync(x => x.ProductId == productId && x.Id != id);
                var nextMain = remainingImages.FirstOrDefault();
                if (nextMain != null)
                {
                    nextMain.IsMain = true;
                    _unitOfWork.ProductImageRepository.Update(nextMain);
                }
            }

            await _unitOfWork.SaveChangesAsync();
        }
    }
}