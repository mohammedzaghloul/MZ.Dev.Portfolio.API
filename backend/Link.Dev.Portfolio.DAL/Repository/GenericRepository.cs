using Link.Dev.Profolie.DAL.Data;
using Link.Dev.Profolie.DAL.Model;
using Link.Dev.Profolie.DAL.Repository;
using Microsoft.EntityFrameworkCore;

public class GenericRepository<T> : IGenericRepository<T> where T : ModelBase
{
    private readonly ApplicationDbContext dbContext;

    public GenericRepository(ApplicationDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<bool> AddAsync(T entity)
    {
        if (entity != null)
            await dbContext.Set<T>().AddAsync(entity);
        return true;
    }

    public async Task<bool> DeleteAsync(T entity)
    {
     
         dbContext.Set<T>().Remove(entity);
            return true;
       
        
    }

    public async Task<IReadOnlyList<T>> GetAllAsync()
    {
        return await dbContext.Set<T>().AsNoTracking().ToListAsync();
    }

    public async Task<T> GetByIdAsync(int id)
    {
        var entity = await dbContext.Set<T>().FindAsync(id);
        return entity!;

    }

    public void Update(T entity)
    {
        if (entity != null)
            dbContext.Set<T>().Update(entity);
    }
}