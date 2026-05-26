using Link.Dev.Profolie.BLL.Dto.ExperienceDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Link.Dev.Profolie.BLL.interfaces
{
    public interface IExperienceService
    {
        Task<IReadOnlyList<ExperienceDto>> GetAllAsync();
        Task<ExperienceDto> GetByIdAsync(int id);
        Task<IReadOnlyList<ExperienceDto>> GetExperiencesByUserIdAsync(string userId);
        Task AddAsync(CreateExperienceDto dto);
        Task UpdateAsync(UpdateExperienceDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
