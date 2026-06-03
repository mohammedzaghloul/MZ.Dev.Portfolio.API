using AutoMapper;
using Microsoft.AspNetCore.Http;

namespace Link.Dev.Profolie.BLL.AutoMapper
{
    public class ImageUrlResolver : IMemberValueResolver<object, object, string?, string?>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ImageUrlResolver(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string? Resolve(object source, object destination, string? sourceMember, string? destMember, ResolutionContext context)
        {
            if (string.IsNullOrEmpty(sourceMember))
                return null;

            var request = _httpContextAccessor.HttpContext?.Request;
            if (request != null)
            {
                var baseUrl = $"{request.Scheme}://{request.Host}";
                return $"{baseUrl}/{sourceMember.TrimStart('/')}";
            }

            return sourceMember;
        }
    }
}
