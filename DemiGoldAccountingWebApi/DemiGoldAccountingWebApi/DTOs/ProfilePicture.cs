using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DemiGoldAccountingWebApi.DTOs
{
    public class ProfilePicture
    {
        public int EntityId { get; set; }
        public IFormFile File { get; set; }
    }
}
