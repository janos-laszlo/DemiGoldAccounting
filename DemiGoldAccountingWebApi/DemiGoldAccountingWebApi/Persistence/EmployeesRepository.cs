using DemiGoldAccountingWebApi.Domain;
using DemiGoldAccountingWebApi.DTOs;
using DemiGoldAccountingWebApi.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace DemiGoldAccountingWebApi.Persistence
{
    public class EmployeesRepository : RepositoryBase<Employee>
    {
        readonly IConfiguration _configuration;

        public EmployeesRepository(DemiGoldAccountingContext db, IConfiguration configuration) : base(db)
        {
            _configuration = configuration;
        }

        public void Add(Employee employee)
        {
            if (_db.Employees.Any(e => e.Name == employee.Name))
            {
                throw new TranslatableException("EC13");
            }

            _db.Employees.Add(employee);
        }

        public void Delete(int id)
        {
            var employee = _db.Employees.Include(e => e.Transactions).SingleOrDefault(e => e.Id == id);

            if (employee == null)
            {
                return;
            }

            DeleteEmployeeProfilePicture(employee.Name);
            _db.Transactions.RemoveRange(employee.Transactions.Where(t => t.RowDeleted));
            _db.Employees.Remove(employee);
        }

        public ActionResult<IEnumerable<Employee>> GetAll()
        {
            return _db.Employees;
        }

        public string SetProfilePicture(ProfilePicture profilePicture)
        {
            Employee employee = _db.Employees.FirstOrDefault(c => c.Id == profilePicture.EntityId);
            if (employee == null)
            {
                throw new TranslatableException("EC9", profilePicture.EntityId.ToString());
            }

            string fileName = employee.Name + ".png";
            if (CloudStorageAccount.TryParse(_configuration[Constants.BlobStorageConnectionString], out CloudStorageAccount storageAccount))
            {
                CloudBlobClient cloudBlobClient = storageAccount.CreateCloudBlobClient();
                CloudBlobContainer cloudBlobContainer = cloudBlobClient.GetContainerReference(_configuration[Constants.BlobStorageEmployeeProfilePictureContainer]);
                CloudBlockBlob cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(fileName);
                using (Stream profilePictureStream = profilePicture.File.OpenReadStream())
                {
                    cloudBlockBlob.UploadFromStreamAsync(profilePictureStream)
                        .GetAwaiter()
                        .GetResult();
                }
                employee.HasProfilePicture = true;

                return fileName;
            }
            else
            {
                throw new TranslatableException("EC11");
            }
        }

        private void DeleteEmployeeProfilePicture(string employeeName)
        {
            if (CloudStorageAccount.TryParse(_configuration[Constants.BlobStorageConnectionString], out CloudStorageAccount storageAccount))
            {
                CloudBlobClient cloudBlobClient = storageAccount.CreateCloudBlobClient();
                CloudBlobContainer cloudBlobContainer = cloudBlobClient.GetContainerReference(_configuration[Constants.BlobStorageEmployeeProfilePictureContainer]);
                CloudBlockBlob cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(employeeName + ".png");
                cloudBlockBlob.DeleteIfExistsAsync().GetAwaiter().GetResult();
            }
            else
            {
                throw new TranslatableException("EC12");
            }
        }
    }
}
