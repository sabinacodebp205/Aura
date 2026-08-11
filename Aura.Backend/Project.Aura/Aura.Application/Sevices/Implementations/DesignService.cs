using Aura.Application.DTOs.Design;
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
    public class DesignService : IDesignService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public DesignService(
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<ICollection<DesignGetDto>> GetAllAsync()
        {
            var designs = await _unitOfWork.DesignRepository.GetAllAsync();

            return _mapper.Map<ICollection<DesignGetDto>>(designs);
        }

        public async Task<DesignGetDto?> GetByIdAsync(Guid id)
        {
            var design = await _unitOfWork.DesignRepository.GetByIdAsync(id);

            if (design == null)
                return null;

            return _mapper.Map<DesignGetDto>(design);
        }

        public async Task CreateAsync(DesignCreateDto dto, Guid userId)
        {
            var product = await _unitOfWork.ProductRepository.GetByIdAsync(dto.ProductId);

            if (product == null)
                throw new Exception("Product not found.");

            var design = _mapper.Map<Design>(dto);

            design.UserId = userId;
            design.ImageUrl = string.Empty;
            design.ExtraPrice = 5;

            await _unitOfWork.DesignRepository.AddAsync(design);

            await _unitOfWork.SaveChangesAsync();
        }
        public async Task UpdateAsync(DesignUpdateDto dto)
        {
            var design = await _unitOfWork.DesignRepository.GetByIdAsync(dto.Id);

            if (design == null)
                throw new Exception("Design not found.");

            design.Prompt = dto.Prompt;

            _unitOfWork.DesignRepository.Update(design);

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var design = await _unitOfWork.DesignRepository.GetByIdAsync(id);

            if (design == null)
                throw new Exception("Design not found.");

            _unitOfWork.DesignRepository.Delete(design);

            await _unitOfWork.SaveChangesAsync();
        }
    }
}
