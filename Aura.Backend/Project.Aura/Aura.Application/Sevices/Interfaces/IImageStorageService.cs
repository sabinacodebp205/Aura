using Aura.Application.DTOs.ImageStorage;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Aura.Application.Sevices.Interfaces
{
    public interface IImageStorageService
    {
        Task<string> SaveImageAsync(IFormFile file);
        Task<ImageResult?> GetImageAsync(string id);
        Task<bool> DeleteImageAsync(string id);
    }
}
