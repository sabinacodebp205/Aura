using Aura.Application.DTOs.Auth;
using Aura.Application.Sevices.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Aura.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            await _authService.RegisterAsync(dto);

            return Ok(new
            {
                Message = "User registered successfully."
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var token = await _authService.LoginAsync(dto);

            return Ok(new
            {
                Token = token
            });
        }
    }
}
