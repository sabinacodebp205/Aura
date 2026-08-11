using Aura.Application.DTOs.Category;
using Aura.Application.Sevices.Implementations;
using Aura.Core.Entities;
using Aura.Core.Interfaces.Repositories;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Sevices.Interfaces
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CategoryService(
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<ICollection<CategoryGetDto>> GetAllAsync()
        {
            var categories = await _unitOfWork.CategoryRepository.GetAllAsync();

            return _mapper.Map<ICollection<CategoryGetDto>>(categories);
        }

        public async Task<CategoryGetDto?> GetByIdAsync(Guid id)
        {
            var category = await _unitOfWork.CategoryRepository.GetByIdAsync(id);

            if (category == null)
                return null;

            return _mapper.Map<CategoryGetDto>(category);
        }

        public async Task CreateAsync(CategoryCreateDto dto)
        {
            var exist = await _unitOfWork.CategoryRepository.AnyAsync(x => x.Name == dto.Name);

            if (exist)
                throw new Exception("Category already exists.");

            var category = _mapper.Map<Category>(dto);

            await _unitOfWork.CategoryRepository.AddAsync(category);

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task UpdateAsync(CategoryUpdateDto dto)
        {
            var category = await _unitOfWork.CategoryRepository.GetByIdAsync(dto.Id);

            if (category == null)
                throw new Exception("Category not found.");

            _mapper.Map(dto, category);

            _unitOfWork.CategoryRepository.Update(category);

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var category = await _unitOfWork.CategoryRepository.GetByIdAsync(id);

            if (category == null)
                throw new Exception("Category not found.");

            _unitOfWork.CategoryRepository.Delete(category);

            await _unitOfWork.SaveChangesAsync();
        }
    }
}
