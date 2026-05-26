using Link.Dev.Profolie.DAL.Data;
using Link.Dev.Profolie.DAL.Model;
using Link.Dev.Profolie.DAL.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Link.Dev.Profolie.DAL.UnitOfWorks
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext dbContext;
        private readonly Dictionary<string, object> _repositories;

        public UnitOfWork( ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
            _repositories = new Dictionary<string, object>();
        }

        public IGenericRepository<T> Repository<T>() where T : ModelBase
        {
            var key = typeof(T).Name;

            if (!_repositories.ContainsKey(key))
            {
                var repo = new GenericRepository<T>(dbContext);
                _repositories.Add(key, repo);
            }


            return (IGenericRepository<T>)_repositories[key];
        }

        #region Complete

        public async Task<int> CompleteAsync()
        {
            return await dbContext.SaveChangesAsync();
        }

        #endregion

        #region Dispose

        public void Dispose()
        {
            dbContext.Dispose();
        }

        #endregion
    }
}
