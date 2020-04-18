using Microsoft.AspNetCore.Http;

namespace DemiGoldAccountingWebApi.Utilities
{
    public static class TranslationCodes
    {
        public const string ErrorCode = "EC";
        public const string OperationCode = "OC";
    }

    public static class Utils
    {
        public static int GetLanguageIdFromRequestHeaders(IHeaderDictionary headers)
        {
            if (headers.ContainsKey("Content-Language"))
            {
                return int.TryParse(headers["Content-Language"], out int languageId) ? languageId : 1;
            }

            return 1;
        }
    }
}
