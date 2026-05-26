using Link.Dev.Profolie.BLL.Dto.ProjectDto;
using System;
using System.Collections.Generic;
using System.Text;

namespace Link.Dev.Profolie.BLL.interfaces
{
    public interface IProjectServices
    {
        Task<IReadOnlyList<GetAllProject>> GetAllAsync();
        Task<GetByIdProject> GetByIdAsync(int id);
        Task<IReadOnlyList<GetAllProject>> GetByUserIdAsync(string userId);
        Task AddAsync(CreateProjectDto entity);
        Task UpdateAsync(ProjectUpdateDto entity);
        Task<bool> DeleteAsync(int id);
    }
}
