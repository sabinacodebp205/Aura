using Aura.Application.DTOs.Chat;
using System.Threading.Tasks;

namespace Aura.Application.Sevices.Interfaces
{
    public interface IChatService
    {
        Task<ChatResponseDto> ProcessMessageAsync(ChatRequestDto dto);
    }
}
