using System;
using System.Collections.Generic;
using System.Text;

namespace Link.Dev.Profolie.DAL.Model
{
    public class ModelBase
    {
        public int Id { get; set; }
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
        public int CreatedBy { get; set; }
        public int LastModifiedBy { get; set; }
        public DateTime LastModifiedOn { get; set; }
        public bool IsDeleted { get; set; } = false;

    }
}
