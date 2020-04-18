using DemiGoldAccountingWebApi.Domain;
using DemiGoldAccountingWebApi.DTOs;
using DemiGoldAccountingWebApi.Utilities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace DemiGoldAccountingWebApi.Persistence
{
    public class TranslationRepository : RepositoryBase<Text>
    {
        public TranslationRepository(DemiGoldAccountingContext db) : base(db) { }

        public TranslationText GetTranslationsForLanguage(int languageId)
        {
            var language = _db.Languages.Include(l => l.Texts).ThenInclude(t => t.TextPosition).Single(l => l.Id == languageId);

            return new TranslationText
            {
                Id = language.Id,
                Language = language.Name,
                TranslationTextPositions = language.Texts
                                                   .Where(t => !t.TextPosition.OnServer)
                                                   .Select(t => new TranslationTextPosition
                                                   {
                                                       TextPosition = t.TextPosition.Name,
                                                       TextValue = t.Value
                                                   })
            };
        }

        public string GetTranslation(int languageId, string translationCode)
        {
            if (translationCode.StartsWith(TranslationCodes.ErrorCode) || translationCode.StartsWith(TranslationCodes.OperationCode))
            {
                return _db.Texts.First(t => t.LanguageId == languageId && t.TextPosition.Name == translationCode).Value;
            }

            return translationCode;
        }

        public IEnumerable<TranslationLanguage> GetLanguages()
        {
            return _db.Languages.Select(l => new TranslationLanguage
            {
                Id = l.Id,
                Name = l.Name
            }).ToList();
        }
    }
}
