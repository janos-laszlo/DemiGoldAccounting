using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DemiGoldAccountingWebApi.Domain
{
    public class Text
    {
        [Key]
        public int Id { get; set; }

        [StringLength(1024)]
        [Required]
        public string Value { get; set; }

        [ForeignKey("Language")]
        public int LanguageId { get; set; }
        public Language Language { get; set; }

        [ForeignKey("TextPosition")]
        public int TextPositionId { get; set; }
        public TextPosition TextPosition { get; set; }
    }
}
