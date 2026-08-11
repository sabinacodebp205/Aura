using Aura.Application.DTOs.AppUser;
using Aura.Application.Sevices.Interfaces;
using Aura.Core.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Sevices.Implementations
{
    public class AppUserService : IAppUserService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;

        public AppUserService(UserManager<AppUser> userManager,
                              IMapper mapper)
        {
            _userManager = userManager;
            _mapper = mapper;
        }

        public async Task<ICollection<UserGetDto>> GetAllAsync()
        {
            var users = _userManager.Users.ToList();

            return _mapper.Map<ICollection<UserGetDto>>(users);
        }

        public async Task<UserGetDto?> GetByIdAsync(Guid id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());

            if (user == null)
                throw new Exception("User not found.");

            return _mapper.Map<UserGetDto>(user);
        }

        public async Task UpdateProfileAsync(Guid id, UpdateProfileDto dto)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());

            if (user == null)
                throw new Exception("User not found.");

            _mapper.Map(dto, user);

            await _userManager.UpdateAsync(user);
        }

        public async Task DeleteAsync(Guid id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());

            if (user == null)
                throw new Exception("User not found.");

            await _userManager.DeleteAsync(user);
        }
    }
}
