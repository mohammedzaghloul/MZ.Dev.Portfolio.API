using AutoMapper;
using Link.Dev.Profolie.BLL.Dto.UserProfileDto;
using Link.Dev.Profolie.BLL.ErrorException;
using Link.Dev.Profolie.BLL.interfaces;
using Link.Dev.Profolie.BLL.interfaces.Upload;
using Link.Dev.Profolie.DAL.Model;
using Microsoft.AspNetCore.Identity;
using Link.Dev.E_Commerce.BLL.Services.ErrorException;

namespace Link.Dev.Profolie.BLL.Services
{
    public class UserProfileService : IUserProfileService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAttachmentService _attachmentService;
        private readonly IMapper _mapper;

        public UserProfileService(
            UserManager<ApplicationUser> userManager,
            IAttachmentService attachmentService,
            IMapper mapper)
        {
            _userManager = userManager;
            _attachmentService = attachmentService;
            _mapper = mapper;
        }

        public async Task<UserProfileResponse> GetByIdAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new NotFoundException($"User with ID '{userId}' not found.");

            return _mapper.Map<UserProfileResponse>(user);
        }

        public async Task<UserProfileResponse> UpdateAsync(string userId, UpdateUserProfileDto dto)
        {
            if (dto == null)
                throw new BadRequestException("Profile data cannot be null.");

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new NotFoundException($"User with ID '{userId}' not found.");

            if (!string.IsNullOrWhiteSpace(dto.UserName))  user.UserName = dto.UserName;
            if (!string.IsNullOrWhiteSpace(dto.Title))    user.Title    = dto.Title;
            if (!string.IsNullOrWhiteSpace(dto.About))    user.About    = dto.About;
            if (!string.IsNullOrWhiteSpace(dto.Template)) user.Template = dto.Template;
            if (dto.IsActive.HasValue)                 user.IsActive = dto.IsActive.Value;

            if (dto.RemoveImage && !string.IsNullOrEmpty(user.Image))
            {
                var fileName = Path.GetFileName(user.Image);
                _attachmentService.DeleteFile(fileName, "avatars");
                user.Image = null;
            }

            if (dto.ImageFile != null)
            {
                user.Image = await _attachmentService.UpdateFileAsync(
                    dto.ImageFile,
                    user.Image ?? "",
                    "avatars");
            }

            if (dto.RemoveResume && !string.IsNullOrEmpty(user.ResumeUrl))
            {
                var fileName = Path.GetFileName(user.ResumeUrl);
                _attachmentService.DeleteFile(fileName, "resumes");
                user.ResumeUrl = null;
            }

            if (dto.ResumeFile != null)
            {
                user.ResumeUrl = await _attachmentService.UpdateFileAsync(
                    dto.ResumeFile,
                    user.ResumeUrl ?? "",
                    "resumes",
                    new List<string> { ".pdf", ".doc", ".docx" },
                    5 * 1024 * 1024);
            }

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new BadRequestException($"Failed to update profile: {errors}");
            }

            return _mapper.Map<UserProfileResponse>(user);
        }

        public async Task<bool> DeleteAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new NotFoundException($"User with ID '{userId}' not found.");

            // Delete profile image if exists
            if (!string.IsNullOrEmpty(user.Image))
            {
                var fileName = Path.GetFileName(user.Image);
                _attachmentService.DeleteFile(fileName, "avatars");
            }

            if (!string.IsNullOrEmpty(user.ResumeUrl))
            {
                var fileName = Path.GetFileName(user.ResumeUrl);
                _attachmentService.DeleteFile(fileName, "resumes");
            }

            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded;
        }
    }
}
