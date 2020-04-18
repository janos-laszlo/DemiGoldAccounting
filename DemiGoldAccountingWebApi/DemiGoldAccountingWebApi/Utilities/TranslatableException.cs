using System;
using System.Collections.Generic;

namespace DemiGoldAccountingWebApi.Utilities
{
    public class TranslatableException : Exception
    {
        public TranslatableException(string translationCode, params string[] parameters)
        {
            TranslationCode = translationCode;
            Parameters = parameters;
        }

        public string TranslationCode { get; set; }
        public string[] Parameters { get; set; }
    }
}
