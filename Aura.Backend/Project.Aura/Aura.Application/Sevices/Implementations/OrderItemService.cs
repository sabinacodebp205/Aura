using Aura.Application.DTOs.OrderItem;
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
    public class OrderItemService : IOrderItemService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public OrderItemService(
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<ICollection<OrderItemGetDto>> GetAllAsync()
        {
            var orderItems = await _unitOfWork.OrderItemRepository.GetAllAsync();

            return _mapper.Map<ICollection<OrderItemGetDto>>(orderItems);
        }

        public async Task<OrderItemGetDto?> GetByIdAsync(Guid id)
        {
            var orderItem = await _unitOfWork.OrderItemRepository.GetByIdAsync(id);

            if (orderItem == null)
                return null;

            return _mapper.Map<OrderItemGetDto>(orderItem);
        }

        public async Task CreateAsync(OrderItemCreateDto dto)
        {
            var product = await _unitOfWork.ProductRepository.GetByIdAsync(dto.ProductId);

            if (product == null)
                throw new Exception("Product not found.");

            if (dto.DesignId.HasValue)
            {
                var design = await _unitOfWork.DesignRepository.GetByIdAsync(dto.DesignId.Value);

                if (design == null)
                    throw new Exception("Design not found.");
            }

            if (product.StockCount < dto.Quantity)
                throw new Exception("Not enough stock.");

            var orderItem = _mapper.Map<OrderItem>(dto);

            await _unitOfWork.OrderItemRepository.AddAsync(orderItem);

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task UpdateAsync(Guid id, OrderItemCreateDto dto)
        {
            var orderItem = await _unitOfWork.OrderItemRepository.GetByIdAsync(id);

            if (orderItem == null)
                throw new Exception("Order item not found.");

            var product = await _unitOfWork.ProductRepository.GetByIdAsync(dto.ProductId);

            if (product == null)
                throw new Exception("Product not found.");

            if (dto.DesignId.HasValue)
            {
                var design = await _unitOfWork.DesignRepository.GetByIdAsync(dto.DesignId.Value);

                if (design == null)
                    throw new Exception("Design not found.");
            }

            if (product.StockCount < dto.Quantity)
                throw new Exception("Not enough stock.");

            orderItem.ProductId = dto.ProductId;
            orderItem.Quantity = dto.Quantity;
            orderItem.DesignId = dto.DesignId;

            _unitOfWork.OrderItemRepository.Update(orderItem);

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var orderItem = await _unitOfWork.OrderItemRepository.GetByIdAsync(id);

            if (orderItem == null)
                throw new Exception("Order item not found.");

            _unitOfWork.OrderItemRepository.Delete(orderItem);

            await _unitOfWork.SaveChangesAsync();
        }
    }
}
