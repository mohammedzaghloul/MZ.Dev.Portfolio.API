using AutoMapper;
using Link.Dev.Profolie.BLL.Dto.ContactDto;
using Link.Dev.Profolie.BLL.Dto.ProjectDto;
using Link.Dev.Profolie.BLL.Dto.ProjectSkillDto;
using Link.Dev.Profolie.BLL.Dto.SkillDto;
using Link.Dev.Profolie.BLL.Dto.UserProfileDto;
using Link.Dev.Profolie.DAL.Model;

namespace Link.Dev.Profolie.BLL.AutoMapper
{
    public class MappingAutoMapper : Profile
    {
        public MappingAutoMapper()
        {
            // Contact Mappings
            CreateMap<Contact, ContactResponse>().ReverseMap();
            CreateMap<CreateContactDto, Contact>();
            CreateMap<UpdateContactDto, Contact>();

            // Project Mappings
            CreateMap<Project, GetAllProject>()
                .ForMember(dest => dest.Image, opt => opt.MapFrom<ImageUrlResolver, string?>(src => src.Image));
            CreateMap<GetAllProject, Project>();

            CreateMap<Project, GetByIdProject>()
                .ForMember(dest => dest.Image, opt => opt.MapFrom<ImageUrlResolver, string?>(src => src.Image));
            CreateMap<GetByIdProject, Project>();

            CreateMap<CreateProjectDto, Project>()
                .ForMember(dest => dest.Image, opt => opt.Ignore());
            CreateMap<ProjectUpdateDto, Project>()
                .ForMember(dest => dest.Image, opt => opt.Ignore());

            // Skill Mappings
            CreateMap<Skill, SkillResponse>().ReverseMap();
            CreateMap<CreateSkillDto, Skill>();
            CreateMap<UpdateSkillDto, Skill>();

            // ProjectSkill Mappings
            CreateMap<ProjectSkill, ProjectSkillResponse>().ReverseMap();
            CreateMap<CreateProjectSkillDto, ProjectSkill>();

            // Experience Mappings
            CreateMap<Experience, Link.Dev.Profolie.BLL.Dto.ExperienceDto.ExperienceDto>().ReverseMap();
            CreateMap<Link.Dev.Profolie.BLL.Dto.ExperienceDto.CreateExperienceDto, Experience>();
            CreateMap<Link.Dev.Profolie.BLL.Dto.ExperienceDto.UpdateExperienceDto, Experience>();

            // User Profile Mappings
            CreateMap<ApplicationUser, UserProfileResponse>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => dest.About, opt => opt.MapFrom(src => src.About))
                .ForMember(dest => dest.Image, opt => opt.MapFrom<ImageUrlResolver, string?>(src => src.Image))
                .ForMember(dest => dest.ResumeUrl, opt => opt.MapFrom<ImageUrlResolver, string?>(src => src.ResumeUrl))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive))
                .ForMember(dest => dest.Template, opt => opt.MapFrom(src => src.Template));
        }
    }
}
