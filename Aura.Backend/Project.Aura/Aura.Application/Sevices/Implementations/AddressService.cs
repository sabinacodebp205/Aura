using Aura.Application.DTOs.Address;
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
    public class AddressService : IAddressService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AddressService(
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<ICollection<AddressGetDto>> GetAllAsync(Guid userId)
        {
            var addresses = await _unitOfWork.AddressRepository.FindAllAsync(a => a.UserId == userId);

            return _mapper.Map<ICollection<AddressGetDto>>(addresses);
        }

        public async Task<AddressGetDto?> GetByIdAsync(Guid id)
        {
            var address = await _unitOfWork.AddressRepository.GetByIdAsync(id);

            if (address == null)
                return null;

            return _mapper.Map<AddressGetDto>(address);
        }

        public async Task CreateAsync(AddressCreateDto dto, Guid userId)
        {
            var address = _mapper.Map<Address>(dto);

            address.UserId = userId;

            await _unitOfWork.AddressRepository.AddAsync(address);

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task UpdateAsync(AddressUpdateDto dto)
        {
            var address = await _unitOfWork.AddressRepository.GetByIdAsync(dto.Id);

            if (address == null)
                throw new Exception("Address not found.");

            _mapper.Map(dto, address);

            _unitOfWork.AddressRepository.Update(address);

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var address = await _unitOfWork.AddressRepository.GetByIdAsync(id);

            if (address == null)
                throw new Exception("Address not found.");

            _unitOfWork.AddressRepository.Delete(address);

            await _unitOfWork.SaveChangesAsync();
        }
    }
}
