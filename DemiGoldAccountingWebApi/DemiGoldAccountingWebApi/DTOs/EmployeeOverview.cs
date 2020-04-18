using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DemiGoldAccountingWebApi.DTOs
{
    public class EmployeeOverview
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool HasProfilePicture { get; set; }
        public decimal TotalGiven { get; set; }
    }
}
