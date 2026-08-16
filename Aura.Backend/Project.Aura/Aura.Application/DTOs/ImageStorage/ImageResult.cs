using System;

namespace Aura.Application.DTOs.ImageStorage
{
    public class ImageResult
    {
        public byte[] Data { get; set; } = Array.Empty<byte>();
        public string ContentType { get; set; } = "image/jpeg";
    }
}
