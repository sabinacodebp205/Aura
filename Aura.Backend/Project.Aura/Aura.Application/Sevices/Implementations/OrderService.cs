using Aura.Application.DTOs.Order;
using Aura.Application.Sevices.Interfaces;
using Aura.Core.Entities;
using Aura.Core.Enums;
using Aura.Core.Interfaces.Repositories;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Aura.Application.Sevices.Implementations
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ICouponService _couponService;

        public OrderService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ICouponService couponService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _couponService = couponService;
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
            decimal totalProductPrice = 0;

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

                totalProductPrice += product.Price * item.Quantity;

                order.OrderItems.Add(new OrderItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity
                });
            }

            decimal discountAmount = 0;
            string? appliedCouponCode = null;

            if (!string.IsNullOrWhiteSpace(dto.CouponCode))
            {
                var validation = await _couponService.ValidateCouponAsync(dto.CouponCode);
                if (validation.IsValid)
                {
                    appliedCouponCode = validation.Code;
                    discountAmount = Math.Round(totalProductPrice * (validation.DiscountPercent / 100m), 2);
                    if (validation.MaxDiscountAmount.HasValue && discountAmount > validation.MaxDiscountAmount.Value)
                    {
                        discountAmount = validation.MaxDiscountAmount.Value;
                    }
                }
            }

            order.TotalPrice = Math.Max(0, totalProductPrice - discountAmount);
            order.CouponCode = appliedCouponCode;
            order.DiscountAmount = discountAmount;

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
