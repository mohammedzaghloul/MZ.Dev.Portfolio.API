using Link.Dev.Profolie.DAL.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace Link.Dev.Profolie.DAL.Repository
{
    public interface IGenericRepository<T> where T : ModelBase
    {
        Task<IReadOnlyList<T>> GetAllAsync();
        Task<T> GetByIdAsync(int id);

        Task<bool> AddAsync(T entity);
        void Update(T entity);
        Task<bool> DeleteAsync(T entity);
    }
}
