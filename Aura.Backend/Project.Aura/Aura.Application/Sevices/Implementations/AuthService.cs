using Aura.Application.DTOs.Auth;
using Aura.Application.Sevices.Interfaces;
using Aura.Core.Entities;
using Aura.Core.Exceptions;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Sevices.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;
        private readonly ITokenService _tokenService;

        public AuthService(
            UserManager<AppUser> userManager,
            IMapper mapper,
            ITokenService tokenService)
        {
            _userManager = userManager;
            _mapper = mapper;
            _tokenService = tokenService;
        }

        public async Task RegisterAsync(RegisterDto dto)
        {
            var existUser = await _userManager.FindByEmailAsync(dto.Email);

            if (existUser != null)
                throw new ConflictException("User already exists.");

            var user = _mapper.Map<AppUser>(dto);

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
                throw new BadRequestException(result.Errors.First().Description);
        }

        public async Task<string> LoginAsync(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);

            if (user == null)
                throw new UnauthorizedException("Email or Password is incorrect.");

            var isPasswordCorrect = await _userManager.CheckPasswordAsync(user, dto.Password);

            if (!isPasswordCorrect)
                throw new UnauthorizedException("Email or Password is incorrect.");

            // JWT Token yaratılır
            var token = _tokenService.CreateToken(user);

            return token;
        }
    }
}
