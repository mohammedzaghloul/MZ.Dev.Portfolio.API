using AutoMapper;
using Link.Dev.Profolie.BLL.Dto.SkillDto;
using Link.Dev.Profolie.BLL.ErrorException;
using Link.Dev.Profolie.BLL.interfaces;
using Link.Dev.Profolie.BLL.interfaces.Upload;
using Link.Dev.Profolie.DAL.Model;
using Link.Dev.Profolie.DAL.UnitOfWorks;
using Link.Dev.E_Commerce.BLL.Services.ErrorException;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Link.Dev.Profolie.BLL.Services
{
    public class SkillService : ISkillService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IAttachmentService _attachmentService;

        public SkillService(IUnitOfWork unitOfWork, IMapper mapper, IAttachmentService attachmentService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _attachmentService = attachmentService;
        }

        public async Task<IReadOnlyList<SkillResponse>> GetAllAsync()
        {
            var skills = await _unitOfWork.Repository<Skill>().GetAllAsync();
            return _mapper.Map<IReadOnlyList<SkillResponse>>(skills);
        }

        public async Task<SkillResponse> GetByIdAsync(int id)
        {
            var skill = await _unitOfWork.Repository<Skill>().GetByIdAsync(id);
            if (skill == null)
                throw new NotFoundException($"Skill with ID {id} not found");

            return _mapper.Map<SkillResponse>(skill);
        }

        public async Task<IReadOnlyList<SkillResponse>> GetByUserIdAsync(string userId)
        {
            var skills = await _unitOfWork.Repository<Skill>().GetAllAsync();
            var userSkills = skills.Where(s => s.UserId == userId).ToList();
            return _mapper.Map<IReadOnlyList<SkillResponse>>(userSkills);
        }

        public async Task<SkillResponse> AddAsync(CreateSkillDto dto)
        {
            if (dto == null)
                throw new BadRequestException("Skill data cannot be null");

            var skill = _mapper.Map<Skill>(dto);
            await _unitOfWork.Repository<Skill>().AddAsync(skill);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<SkillResponse>(skill);
        }

        public async Task UpdateAsync(UpdateSkillDto dto)
        {
            if (dto == null)
                throw new BadRequestException("Skill data cannot be null");

            var existingSkill = await _unitOfWork.Repository<Skill>().GetByIdAsync(dto.Id);
            if (existingSkill == null)
                throw new NotFoundException($"Skill with ID {dto.Id} not found");

            _mapper.Map(dto, existingSkill);
            _unitOfWork.Repository<Skill>().Update(existingSkill);
            await _unitOfWork.CompleteAsync();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var skill = await _unitOfWork.Repository<Skill>().GetByIdAsync(id);
            if (skill == null)
                throw new NotFoundException($"Skill with ID {id} not found");

            await _unitOfWork.Repository<Skill>().DeleteAsync(skill);
            await _unitOfWork.CompleteAsync();
            return true;
        }
    }
}
