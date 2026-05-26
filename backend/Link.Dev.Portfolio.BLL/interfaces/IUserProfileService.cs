using Link.Dev.Profolie.BLL.Dto.UserProfileDto;

namespace Link.Dev.Profolie.BLL.interfaces
{
    public interface IUserProfileService
    {
        Task<UserProfileResponse> GetByIdAsync(string userId);
        Task<UserProfileResponse> UpdateAsync(string userId, UpdateUserProfileDto dto);
        Task<bool> DeleteAsync(string userId);
    }
}
