using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DemiGoldAccountingWebApi.Domain
{
    public class TextPosition
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(256)]
        public string Name { get; set; }

        [Required]
        public bool OnServer { get; set; }

        [InverseProperty("TextPosition")]
        public List<Text> Texts { get; set; }
    }
}
