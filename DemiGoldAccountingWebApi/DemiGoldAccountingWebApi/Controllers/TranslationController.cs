using DemiGoldAccountingWebApi.DTOs;
using DemiGoldAccountingWebApi.Persistence;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace DemiGoldAccountingWebApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class TranslationController : ControllerBase
    {
        private readonly TranslationRepository _translationRepository;

        public TranslationController(TranslationRepository translationRepository)
        {
            _translationRepository = translationRepository;
        }

        [HttpGet]
        [Route("{languageId}")]
        public TranslationText GetTranslationText(int languageId)
        {
            return _translationRepository.GetTranslationsForLanguage(languageId);
        }

        [HttpGet]
        [Route("languages")]
        public IEnumerable<TranslationLanguage> GetLanguages()
        {
            return _translationRepository.GetLanguages();
        }
    }
}