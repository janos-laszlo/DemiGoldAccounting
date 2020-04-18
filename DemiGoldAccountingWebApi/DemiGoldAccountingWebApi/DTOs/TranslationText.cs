using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DemiGoldAccountingWebApi.DTOs
{
    public class TranslationText
    {
        public int Id { get; set; }
        public string Language { get; set; }
        public IEnumerable<TranslationTextPosition> TranslationTextPositions { get; set; }        
    }
}
