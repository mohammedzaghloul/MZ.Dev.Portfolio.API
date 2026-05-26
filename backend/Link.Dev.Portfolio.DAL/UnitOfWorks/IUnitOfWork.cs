using Link.Dev.Profolie.DAL.Model;
using Link.Dev.Profolie.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Text;

namespace Link.Dev.Profolie.DAL.UnitOfWorks
{
    public interface IUnitOfWork : IDisposable
    {
 

        Task<int> CompleteAsync();
        IGenericRepository<T> Repository<T>() where T : ModelBase;

    }
}
