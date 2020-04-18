using DemiGoldAccountingWebApi.Persistence;
using DemiGoldAccountingWebApi.Utilities;
using Microsoft.AspNetCore.Http;
using System;

namespace DemiGoldAccountingWebApi.Translations
{
    public class TranslationService
    {
        private readonly TranslationRepository _translationRepository;

        public TranslationService(TranslationRepository translationRepository)
        {
            _translationRepository = translationRepository;
        }

        public string TranslateException(Exception exception, IHeaderDictionary headers)
        {
            if (exception is TranslatableException)
            {
                TranslatableException translatableException = exception as TranslatableException;
                return string.Format(
                    _translationRepository.GetTranslation(
                        Utils.GetLanguageIdFromRequestHeaders(headers),
                        translatableException.TranslationCode),
                    translatableException.Parameters);
            }

            return exception.Message;
        }

        public string Translate(IHeaderDictionary headers, string translationCode, params string[] translationParameters)
        {
            return string.Format(
                _translationRepository.GetTranslation(
                    Utils.GetLanguageIdFromRequestHeaders(headers),
                    translationCode),
                translationParameters);
        }
    }
}
