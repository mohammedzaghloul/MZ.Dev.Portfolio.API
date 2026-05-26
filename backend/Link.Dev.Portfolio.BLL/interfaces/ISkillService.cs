using Link.Dev.Profolie.BLL.Dto.SkillDto;

namespace Link.Dev.Profolie.BLL.interfaces
{
    public interface ISkillService
    {
        Task<IReadOnlyList<SkillResponse>> GetAllAsync();
        Task<SkillResponse> GetByIdAsync(int id);
        Task<IReadOnlyList<SkillResponse>> GetByUserIdAsync(string userId);
        Task<SkillResponse> AddAsync(CreateSkillDto dto);
        Task UpdateAsync(UpdateSkillDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
