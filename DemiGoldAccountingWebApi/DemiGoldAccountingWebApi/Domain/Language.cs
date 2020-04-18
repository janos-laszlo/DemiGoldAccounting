using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DemiGoldAccountingWebApi.Domain
{
    public class Language
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(32)]
        public string Name { get; set; }

        [Required]
        [StringLength(16)]
        public string Code { get; set; }

        [InverseProperty("Language")]
        public List<Text> Texts { get; set; }

        [InverseProperty("Language")]
        public List<Client> Clients { get; set; }
    }
}
