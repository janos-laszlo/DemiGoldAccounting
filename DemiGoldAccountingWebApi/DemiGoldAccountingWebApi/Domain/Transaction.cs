using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DemiGoldAccountingWebApi.Domain
{
    public class Transaction
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Column(TypeName = "decimal(9,2)")]
        public decimal Amount { get; set; }

        [Required]
        public DateTime CreatedOn { get; set; }

        [StringLength(512)]
        public string Description { get; set; }

        [ForeignKey("Employee")]
        public int? EmployeeId { get; set; }
        public Employee Employee { get; set; }

        [ForeignKey("Client")]
        public int? ClientId { get; set; }
        public Client Client { get; set; }

        [Required]
        [ForeignKey("TransactionType")]
        public int TransactionTypeId { get; set; }
        public TransactionType TransactionType { get; set; }

        public bool RowDeleted { get; set; }
    }
}
