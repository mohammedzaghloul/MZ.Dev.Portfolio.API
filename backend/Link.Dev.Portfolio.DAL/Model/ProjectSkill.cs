using System;
using System.Collections.Generic;
using System.Text;

namespace Link.Dev.Profolie.DAL.Model
{
    public class ProjectSkill : ModelBase
    {

        public int ProjectId { get; set; }
        public Project? Project { get; set; }

        public int SkillId { get; set; }
        public Skill? Skill { get; set; }
    }
}
