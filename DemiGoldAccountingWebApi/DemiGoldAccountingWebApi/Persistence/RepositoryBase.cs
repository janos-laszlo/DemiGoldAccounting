using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace DemiGoldAccountingWebApi.Persistence
{
    public abstract class RepositoryBase<T> where T : class
    {
        protected DemiGoldAccountingContext _db;
        protected DbSet<T> _dbSet;

        public RepositoryBase(DemiGoldAccountingContext db)
        {
            _db = db;
            _dbSet = _db.Set<T>();
        }

        public IEnumerable<T> Get()
        {
            return _dbSet.ToList();
        }

        public void SaveChanges()
        {
            _db.SaveChanges();
        }
    }
}
