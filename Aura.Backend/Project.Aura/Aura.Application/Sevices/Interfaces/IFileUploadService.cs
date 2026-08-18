using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Aura.Application.Sevices.Interfaces
{
    [System.Obsolete("Superseded by IImageStorageService for MongoDB image storage.")]
    public interface IFileUploadService
    {
        Task<string> SaveProductImageAsync(IFormFile file);

        void DeleteProductImage(string imageUrl);

    }
}