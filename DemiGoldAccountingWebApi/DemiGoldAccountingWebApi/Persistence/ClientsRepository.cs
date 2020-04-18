using DemiGoldAccountingWebApi.Domain;
using DemiGoldAccountingWebApi.DTOs;
using DemiGoldAccountingWebApi.Utilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System.IO;
using System.Linq;

namespace DemiGoldAccountingWebApi.Persistence
{
    public class ClientsRepository : RepositoryBase<Client>
    {
        readonly IConfiguration _configuration;
        public ClientsRepository(DemiGoldAccountingContext db, IConfiguration configuration) : base(db)
        {
            _configuration = configuration;
        }

        public void Add(Client client)
        {
            if (_db.Clients.Any(c => c.Name.ToLower() == client.Name.ToLower()))
            {
                throw new TranslatableException("EC8");
            }

            _db.Clients.Add(client);
        }

        public void Delete(int id)
        {
            var client = _db.Clients
                .Include(c => c.Transactions)
                .ThenInclude(t => t.TransactionType)
                .SingleOrDefault(c => c.Id == id);

            if (client == null)
            {
                throw new TranslatableException("EC9", id.ToString());
            }

            var nonEmployeeRelatedTransactions = client.Transactions.Where(t => t.TransactionType.Name != Constants.TransactionTypes.Salar.ToString());
            _db.Transactions.RemoveRange(nonEmployeeRelatedTransactions);
            client.Transactions.ForEach(t =>
            {
                t.ClientId = null;
                t.RowDeleted = true;
            });

            DeleteClientProfilePicture(client.Name);

            _db.Clients.Remove(client);
        }

        public string SetProfilePicture(ProfilePicture profilePicture)
        {
            Client client = _db.Clients.FirstOrDefault(c => c.Id == profilePicture.EntityId);
            if (client == null)
            {
                throw new TranslatableException("EC9", profilePicture.EntityId.ToString());
            }

            string fileName = client.Name + ".png";
            if (CloudStorageAccount.TryParse(_configuration[Constants.BlobStorageConnectionString], out CloudStorageAccount storageAccount))
            {
                CloudBlobClient cloudBlobClient = storageAccount.CreateCloudBlobClient();
                CloudBlobContainer cloudBlobContainer = cloudBlobClient.GetContainerReference(_configuration[Constants.BlobStorageClientProfilePictureContainer]);
                CloudBlockBlob cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(fileName);
                using (Stream profilePictureStream = profilePicture.File.OpenReadStream())
                {
                    cloudBlockBlob.UploadFromStreamAsync(profilePictureStream)
                        .GetAwaiter()
                        .GetResult();
                }
                client.HasProfilePicture = true;

                return fileName;
            }
            else
            {
                throw new TranslatableException("EC11");
            }
        }

        private void DeleteClientProfilePicture(string clientName)
        {
            if (CloudStorageAccount.TryParse(_configuration[Constants.BlobStorageConnectionString], out CloudStorageAccount storageAccount))
            {
                CloudBlobClient cloudBlobClient = storageAccount.CreateCloudBlobClient();
                CloudBlobContainer cloudBlobContainer = cloudBlobClient.GetContainerReference(_configuration[Constants.BlobStorageClientProfilePictureContainer]);
                CloudBlockBlob cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(clientName + ".png");
                cloudBlockBlob.DeleteIfExistsAsync().GetAwaiter().GetResult();
            }
            else
            {
                throw new TranslatableException("EC12");
            }
        }
    }
}
