using AutoMapper;
using Link.Dev.Profolie.BLL.Dto.ContactDto;
using Link.Dev.Profolie.BLL.ErrorException;
using Link.Dev.Profolie.DAL.Model;
using Link.Dev.Profolie.DAL.UnitOfWorks;
using Link.Dev.E_Commerce.BLL.Services.ErrorException;
using Microsoft.EntityFrameworkCore;
using Link.Dev.Profolie.BLL.interfaces;

namespace Link.Dev.Profolie.BLL.Services
{
    public class ContactService : IContactService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ContactService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IReadOnlyList<ContactResponse>> GetAllAsync()
        {
            var contacts = await _unitOfWork.Repository<Contact>().GetAllAsync();
            return _mapper.Map<IReadOnlyList<ContactResponse>>(contacts);
        }

        public async Task<ContactResponse> GetByIdAsync(int id)
        {
            var contact = await _unitOfWork.Repository<Contact>().GetByIdAsync(id);
            if (contact == null)
                throw new NotFoundException($"Contact with ID {id} not found");

            return _mapper.Map<ContactResponse>(contact);
        }

        public async Task<ContactResponse?> GetByUserIdAsync(string userId)
        {
            var contacts = await _unitOfWork.Repository<Contact>().GetAllAsync();
            var contact = contacts.FirstOrDefault(c => c.UserId == userId);
            if (contact == null)
                return null;   // no contact yet — not an error

            return _mapper.Map<ContactResponse>(contact);
        }

        public async Task<ContactResponse> AddAsync(CreateContactDto dto)
        {
            if (dto == null)
                throw new BadRequestException("Contact data cannot be null");

            var contact = _mapper.Map<Contact>(dto);
            await _unitOfWork.Repository<Contact>().AddAsync(contact);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<ContactResponse>(contact);
        }

        public async Task UpdateAsync(UpdateContactDto dto)
        {
            if (dto == null)
                throw new BadRequestException("Contact data cannot be null");

            var existingContact = await _unitOfWork.Repository<Contact>().GetByIdAsync(dto.Id);
            if (existingContact == null)
                throw new NotFoundException($"Contact with ID {dto.Id} not found");

            _mapper.Map(dto, existingContact);
            _unitOfWork.Repository<Contact>().Update(existingContact);
            await _unitOfWork.CompleteAsync();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var contact = await _unitOfWork.Repository<Contact>().GetByIdAsync(id);
            if (contact == null)
                throw new NotFoundException($"Contact with ID {id} not found");

            await _unitOfWork.Repository<Contact>().DeleteAsync(contact);
            await _unitOfWork.CompleteAsync();
            return true;
        }
    }
}
