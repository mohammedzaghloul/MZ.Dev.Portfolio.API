using Link.Dev.Profolie.BLL.Dto.ContactDto;
using System;
using System.Collections.Generic;
using System.Text;

namespace Link.Dev.Profolie.BLL.interfaces
{
    public interface IContactService
    {
        Task<IReadOnlyList<ContactResponse>> GetAllAsync();
        Task<ContactResponse> GetByIdAsync(int id);
        Task<ContactResponse?> GetByUserIdAsync(string userId);
        Task<ContactResponse> AddAsync(CreateContactDto dto);
        Task UpdateAsync(UpdateContactDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
