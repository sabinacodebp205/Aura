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
            var emailTrimmed = dto.Email?.Trim() ?? string.Empty;
            var userNameTrimmed = dto.UserName?.Trim() ?? string.Empty;

            var existUser = await _userManager.FindByEmailAsync(emailTrimmed);
            if (existUser != null)
                throw new ConflictException("User with this email already exists.");

            var existUserName = await _userManager.FindByNameAsync(userNameTrimmed);
            if (existUserName != null)
                throw new ConflictException("Username is already taken.");

            var user = _mapper.Map<AppUser>(dto);
            user.Email = emailTrimmed;
            user.UserName = userNameTrimmed;

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
                throw new BadRequestException(result.Errors.First().Description);
        }

        public async Task<string> LoginAsync(LoginDto dto)
        {
            var emailTrimmed = dto.Email?.Trim() ?? string.Empty;
            var user = await _userManager.FindByEmailAsync(emailTrimmed);

            if (user == null || string.IsNullOrEmpty(user.PasswordHash))
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
