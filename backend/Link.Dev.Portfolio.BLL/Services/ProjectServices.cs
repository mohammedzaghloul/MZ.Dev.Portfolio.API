using AutoMapper;
using Link.Dev.Profolie.BLL.Dto.ProjectDto;
using Link.Dev.Profolie.BLL.ErrorException;
using Link.Dev.Profolie.DAL.Model;
using Link.Dev.Profolie.DAL.UnitOfWorks;
using Link.Dev.E_Commerce.BLL.Services.ErrorException;
using Link.Dev.Profolie.BLL.interfaces;
using Link.Dev.Profolie.BLL.interfaces.Upload;

namespace Link.Dev.Profolie.BLL.Services
{
    public class ProjectServices : IProjectServices
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IAttachmentService _attachmentService;

        public ProjectServices(IUnitOfWork unitOfWork, IMapper mapper, IAttachmentService attachmentService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _attachmentService = attachmentService;
        }

        public async Task<IReadOnlyList<GetAllProject>> GetAllAsync()
        {
            var projects = await _unitOfWork.Repository<Project>().GetAllAsync();
            return _mapper.Map<IReadOnlyList<GetAllProject>>(projects);
        }

        public async Task<IReadOnlyList<GetAllProject>> GetByUserIdAsync(string userId)
        {
            var projects = await _unitOfWork.Repository<Project>().GetAllAsync();
            var userProjects = projects.Where(p => p.UserId == userId).ToList();
            return _mapper.Map<IReadOnlyList<GetAllProject>>(userProjects);
        }

        public async Task<GetByIdProject> GetByIdAsync(int id)
        {
            var project = await _unitOfWork.Repository<Project>().GetByIdAsync(id);
            if (project == null)
                throw new NotFoundException($"Project with ID {id} not found");

            return _mapper.Map<GetByIdProject>(project);
        }

        public async Task AddAsync(CreateProjectDto dto)
        {
            if (dto == null)
                throw new BadRequestException("Project data cannot be null");

            var project = _mapper.Map<Project>(dto);

            if (dto.Image != null)
            {
                project.Image = await _attachmentService.UploadFileAsync(dto.Image, "projects");
            }

            await _unitOfWork.Repository<Project>().AddAsync(project);
            await _unitOfWork.CompleteAsync();
        }

        public async Task UpdateAsync(ProjectUpdateDto dto)
        {
            if (dto == null)
                throw new BadRequestException("Project data cannot be null");

            var existingProject = await _unitOfWork.Repository<Project>().GetByIdAsync(dto.Id);
            if (existingProject == null)
                throw new NotFoundException($"Project with ID {dto.Id} not found");

            if (dto.ImageFile != null)
            {
                existingProject.Image = await _attachmentService.UpdateFileAsync(dto.ImageFile, existingProject.Image ?? "", "projects");
            }

            _mapper.Map(dto, existingProject);
            _unitOfWork.Repository<Project>().Update(existingProject);
            await _unitOfWork.CompleteAsync();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var project = await _unitOfWork.Repository<Project>().GetByIdAsync(id);
            if (project == null)
                throw new NotFoundException($"Project with ID {id} not found");

            // Delete associated image if exists
            if (!string.IsNullOrEmpty(project.Image))
            {
                var fileName = Path.GetFileName(project.Image);
                _attachmentService.DeleteFile(fileName, "projects");
            }

            await _unitOfWork.Repository<Project>().DeleteAsync(project);
            await _unitOfWork.CompleteAsync();
            return true;
        }
    }
}
