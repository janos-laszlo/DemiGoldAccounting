using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DemiGoldAccountingWebApi.DTOs
{
    public class EmployeeTransactionDetails
    {
        public string ClientName { get; set; }
        public decimal Amount { get; set; }
        public DateTime CreatedOn { get; set; }
        public string Description { get; set; }
    }
}
