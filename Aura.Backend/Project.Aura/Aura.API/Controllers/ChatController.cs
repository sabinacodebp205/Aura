using Aura.Application.DTOs.Chat;
using Aura.Application.Sevices.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Aura.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpPost("message")]
        [AllowAnonymous]
        public async Task<IActionResult> SendMessage([FromBody] ChatRequestDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Message))
            {
                return BadRequest(new { message = "Message content is required." });
            }

            var response = await _chatService.ProcessMessageAsync(dto);
            return Ok(response);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Chat([FromBody] ChatRequestDto dto)
        {
            return await SendMessage(dto);
        }
    }
}
