using AutoMapper;
using Link.Dev.Profolie.BLL.Dto.ExperienceDto;
using Link.Dev.Profolie.BLL.interfaces;
using Link.Dev.Profolie.DAL.Model;
using Link.Dev.Profolie.DAL.UnitOfWorks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Link.Dev.Profolie.BLL.Services
{
    public class ExperienceService : IExperienceService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ExperienceService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IReadOnlyList<ExperienceDto>> GetAllAsync()
        {
            var experiences = await _unitOfWork.Repository<Experience>().GetAllAsync();
            return _mapper.Map<IReadOnlyList<ExperienceDto>>(experiences);
        }

        public async Task<ExperienceDto> GetByIdAsync(int id)
        {
            var experience = await _unitOfWork.Repository<Experience>().GetByIdAsync(id);
            return _mapper.Map<ExperienceDto>(experience);
        }

        public async Task<IReadOnlyList<ExperienceDto>> GetExperiencesByUserIdAsync(string userId)
        {
            var experiences = await _unitOfWork.Repository<Experience>().GetAllAsync();
            var userExperiences = experiences.Where(e => e.UserId == userId).ToList();
            return _mapper.Map<IReadOnlyList<ExperienceDto>>(userExperiences);
        }

        public async Task AddAsync(CreateExperienceDto dto)
        {
            var experience = _mapper.Map<Experience>(dto);
            await _unitOfWork.Repository<Experience>().AddAsync(experience);
            await _unitOfWork.CompleteAsync();
        }

        public async Task UpdateAsync(UpdateExperienceDto dto)
        {
            var experience = await _unitOfWork.Repository<Experience>().GetByIdAsync(dto.Id);
            if (experience != null)
            {
                _mapper.Map(dto, experience);
                _unitOfWork.Repository<Experience>().Update(experience);
                await _unitOfWork.CompleteAsync();
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var experience = await _unitOfWork.Repository<Experience>().GetByIdAsync(id);
            if (experience == null) return false;

            await _unitOfWork.Repository<Experience>().DeleteAsync(experience);
            await _unitOfWork.CompleteAsync();
            return true;
        }
    }
}
