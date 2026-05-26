using AutoMapper;
using Link.Dev.Profolie.BLL.Dto.ProjectSkillDto;
using Link.Dev.Profolie.BLL.ErrorException;
using Link.Dev.Profolie.DAL.Model;
using Link.Dev.Profolie.DAL.UnitOfWorks;
using Link.Dev.E_Commerce.BLL.Services.ErrorException;
using Microsoft.EntityFrameworkCore;
using Link.Dev.Profolie.BLL.interfaces;

namespace Link.Dev.Profolie.BLL.Services
{
    public class ProjectSkillService : IProjectSkillService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ProjectSkillService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IReadOnlyList<ProjectSkillResponse>> GetAllAsync()
        {
            var projectSkills = await _unitOfWork.Repository<ProjectSkill>().GetAllAsync();
            return _mapper.Map<IReadOnlyList<ProjectSkillResponse>>(projectSkills);
        }

        public async Task<ProjectSkillResponse> GetByIdAsync(int id)
        {
            var projectSkill = await _unitOfWork.Repository<ProjectSkill>().GetByIdAsync(id);
            if (projectSkill == null)
                throw new NotFoundException($"ProjectSkill with ID {id} not found");

            return _mapper.Map<ProjectSkillResponse>(projectSkill);
        }

        public async Task<IReadOnlyList<ProjectSkillResponse>> GetByProjectIdAsync(int projectId)
        {
            var projectSkills = await _unitOfWork.Repository<ProjectSkill>().GetAllAsync();
            var filtered = projectSkills.Where(ps => ps.ProjectId == projectId).ToList();
            return _mapper.Map<IReadOnlyList<ProjectSkillResponse>>(filtered);
        }

        public async Task<IReadOnlyList<ProjectSkillResponse>> GetBySkillIdAsync(int skillId)
        {
            var projectSkills = await _unitOfWork.Repository<ProjectSkill>().GetAllAsync();
            var filtered = projectSkills.Where(ps => ps.SkillId == skillId).ToList();
            return _mapper.Map<IReadOnlyList<ProjectSkillResponse>>(filtered);
        }

        public async Task<ProjectSkillResponse> AddAsync(CreateProjectSkillDto dto)
        {
            if (dto == null)
                throw new BadRequestException("ProjectSkill data cannot be null");

            var projectSkill = _mapper.Map<ProjectSkill>(dto);
            await _unitOfWork.Repository<ProjectSkill>().AddAsync(projectSkill);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<ProjectSkillResponse>(projectSkill);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var projectSkill = await _unitOfWork.Repository<ProjectSkill>().GetByIdAsync(id);
            if (projectSkill == null)
                throw new NotFoundException($"ProjectSkill with ID {id} not found");

            await _unitOfWork.Repository<ProjectSkill>().DeleteAsync(projectSkill);
            await _unitOfWork.CompleteAsync();
            return true;
        }
    }
}
