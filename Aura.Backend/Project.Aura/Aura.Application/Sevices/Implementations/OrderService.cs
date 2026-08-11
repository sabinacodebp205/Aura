using Aura.Application.DTOs.Order;
using Aura.Application.Sevices.Interfaces;
using Aura.Core.Entities;
using Aura.Core.Enums;
using Aura.Core.Interfaces.Repositories;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Sevices.Implementations
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public OrderService(
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<ICollection<OrderGetDto>> GetAllAsync()
        {
            var orders = await _unitOfWork.OrderRepository.GetAllAsync();

            return _mapper.Map<ICollection<OrderGetDto>>(orders);
        }

        public async Task<OrderGetDto?> GetByIdAsync(Guid id)
        {
            var order = await _unitOfWork.OrderRepository.GetByIdAsync(id);

            if (order == null)
                return null;

            return _mapper.Map<OrderGetDto>(order);
        }

        public async Task CreateAsync(OrderCreateDto dto, Guid userId)
        {
            decimal totalPrice = 0;

            Order order = new Order
            {
                UserId = userId,
                AddressId = dto.AddressId,
                Status = OrderStatus.Pending,
                PaymentStatus = PaymentStatus.Pending,
                OrderItems = new List<OrderItem>()
            };

            foreach (var item in dto.OrderItems)
            {
                var product = await _unitOfWork.ProductRepository.GetByIdAsync(item.ProductId);

                if (product == null)
                    throw new Exception("Product not found.");

                totalPrice += product.Price * item.Quantity;

                order.OrderItems.Add(new OrderItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    DesignId = item.DesignId
                });
            }

            order.TotalPrice = totalPrice;

            await _unitOfWork.OrderRepository.AddAsync(order);

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task UpdateAsync(OrderUpdateDto dto)
        {
            var order = await _unitOfWork.OrderRepository.GetByIdAsync(dto.Id);

            if (order == null)
                throw new Exception("Order not found.");

            order.AddressId = dto.AddressId;

            _unitOfWork.OrderRepository.Update(order);

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task UpdateStatusAsync(OrderStatusUpdateDto dto)
        {
            var order = await _unitOfWork.OrderRepository.GetByIdAsync(dto.Id);

            if (order == null)
                throw new Exception("Order not found.");

            order.Status = dto.Status;

            _unitOfWork.OrderRepository.Update(order);

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var order = await _unitOfWork.OrderRepository.GetByIdAsync(id);

            if (order == null)
                throw new Exception("Order not found.");

            _unitOfWork.OrderRepository.Delete(order);

            await _unitOfWork.SaveChangesAsync();
        }
    }
}
