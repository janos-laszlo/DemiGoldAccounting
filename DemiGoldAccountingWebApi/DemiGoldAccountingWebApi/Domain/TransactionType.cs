using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DemiGoldAccountingWebApi.Domain
{
    public class TransactionType
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(20)]
        public string Name { get; set; }

        [Required]
        [ForeignKey("Cashflow")]
        public int CashFlowId { get; set; }

        public Cashflow Cashflow { get; set; }

        [InverseProperty("TransactionType")]
        public List<Transaction> Transactions { get; set; }

        public int DisplayIndex { get; set; }
    }
}
