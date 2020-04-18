﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DemiGoldAccountingWebApi.DTOs
{
    public class ClientOverview
    {
        public int Id { get; set; }

        public string ClientName { get; set; }

        public bool HasProfilePicture { get; set; }

        public IEnumerable<TransactionTypeSummary> TransactionTypeSummaries { get; set; }
    }
}
