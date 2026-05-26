using Link.Dev.Profolie.BLL.Dto.ProjectSkillDto;

namespace Link.Dev.Profolie.BLL.interfaces
{
    public interface IProjectSkillService
    {
        Task<IReadOnlyList<ProjectSkillResponse>> GetAllAsync();
        Task<ProjectSkillResponse> GetByIdAsync(int id);
        Task<IReadOnlyList<ProjectSkillResponse>> GetByProjectIdAsync(int projectId);
        Task<IReadOnlyList<ProjectSkillResponse>> GetBySkillIdAsync(int skillId);
        Task<ProjectSkillResponse> AddAsync(CreateProjectSkillDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
