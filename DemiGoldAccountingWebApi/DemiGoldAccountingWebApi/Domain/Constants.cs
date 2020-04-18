using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DemiGoldAccountingWebApi.Domain
{
    public static class Constants
    {
        public const int MaxTransactionAmount = 99999;
        public const string BlobStorageConnectionString = "BlobStorage:ConnectionString";
        public const string MaxFileSizeKey = "BlobStorage:MaxFileSize";
        public const string BlobStorageClientProfilePictureContainer = "BlobStorage:img";
        public const string BlobStorageEmployeeProfilePictureContainer = "BlobStorage:emp";

        public enum TransactionTypes
        {
            Salar
        }
    }
}
