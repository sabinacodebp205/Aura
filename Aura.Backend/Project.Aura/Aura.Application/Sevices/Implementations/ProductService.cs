using Aura.Application.DTOs.Product;
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

    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ProductService(
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<ICollection<ProductGetDto>> GetAllAsync()
        {
            var products = await _unitOfWork.ProductRepository.GetAllAsync();

            return _mapper.Map<ICollection<ProductGetDto>>(products);
        }

        public async Task<ProductDetailsDto?> GetByIdAsync(Guid id)
        {
            var product = await _unitOfWork.ProductRepository.GetByIdAsync(id);

            if (product == null)
                return null;


            return _mapper.Map<ProductDetailsDto>(product);
        }


        public async Task CreateAsync(ProductCreateDto dto)
        {
            var existProduct = await _unitOfWork.ProductRepository.AnyAsync(x => x.Name == dto.Name);

            if (existProduct)
                throw new Exception("Product already exists.");

            var product = _mapper.Map<Product>(dto);

            await _unitOfWork.ProductRepository.AddAsync(product);

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task UpdateAsync(ProductUpdateDto dto)
        {
            var product = await _unitOfWork.ProductRepository.GetByIdAsync(dto.Id);

            if (product == null)
                throw new Exception("Product not found.");

            _mapper.Map(dto, product);

            _unitOfWork.ProductRepository.Update(product);

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var product = await _unitOfWork.ProductRepository.GetByIdAsync(id);

            if (product == null)
                throw new Exception("Product not found.");

            _unitOfWork.ProductRepository.Delete(product);

            await _unitOfWork.SaveChangesAsync();
        }
    }
}
