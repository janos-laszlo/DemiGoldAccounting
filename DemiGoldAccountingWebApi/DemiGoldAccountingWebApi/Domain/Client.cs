using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DemiGoldAccountingWebApi.Domain
{
    public class Client
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(20)]
        public string Name { get; set; }

        [InverseProperty("Client")]
        public List<Transaction> Transactions { get; set; }

        [ForeignKey("Language")]
        public int? LanguageId { get; set; }
        public Language Language { get; set; }

        public bool HasProfilePicture { get; set; }
    }
}
